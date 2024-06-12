package backend

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"time"

	"encore.dev"
	"encore.dev/beta/errs"
	"encore.dev/config"
	"encore.dev/rlog"
	aai "github.com/AssemblyAI/assemblyai-go-sdk"
)

// ServiceConfig represents the runtime configuration for the API.
type ServiceConfig struct {
	UseWebhook config.Bool
}

// Load the service configuration based on the environment.
var cfg *ServiceConfig = config.Load[*ServiceConfig]()

// secrets will be set during runtime by Encore.dev.
var secrets struct {
	AssemblyAIAPIKey        string
	AssemblyAIWebhookSecret string
}

// CreateTranscriptRequest represents the request body for CreateTranscript.
type CreateTranscriptRequest struct {
	// A URL pointing to a media file with voice data.
	AudioURL string `json:"audio_url"`
}

// Validate is run by Encore.dev before the request reaches the handler.
func (req *CreateTranscriptRequest) Validate() error {
	if req.AudioURL == "" {
		return errors.New("missing url")
	}
	return nil
}

// CreateTranscript submits an audio URL for transcription.
//
//encore:api public method=POST path=/api/transcripts
func CreateTranscript(ctx context.Context, req *CreateTranscriptRequest) error {
	eb := errs.B().Meta("audio_url", req.AudioURL)

	transcript, err := getClient().Transcripts.SubmitFromURL(ctx, req.AudioURL, newTranscriptParams())
	if err != nil {
		return eb.Cause(err).Code(errs.Unavailable).Msg("unable to create transcript").Err()
	}

	if err = insert(ctx, aai.ToString(transcript.ID), req.AudioURL, string(transcript.Status)); err != nil {
		return eb.Cause(err).Code(errs.Unavailable).Msg("unable to store transcript").Err()
	}

	return nil
}

// Upload accepts a file sent with a HTML form and and sends it to AssemblyAI
// for transcription.
//
//encore:api public raw method=POST path=/api/upload
func Upload(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()

	if err := req.ParseMultipartForm(32 << 20); err != nil {
		errs.HTTPError(w, errs.WrapCode(err, errs.FailedPrecondition, "unable to parse multipart form"))
		return
	}

	f, fHeader, err := req.FormFile("file")
	if err != nil {
		errs.HTTPError(w, errs.WrapCode(err, errs.FailedPrecondition, "unable to get file"))
		return
	}
	defer f.Close()

	transcript, err := getClient().Transcripts.SubmitFromReader(ctx, f, newTranscriptParams())
	if err != nil {
		errs.HTTPError(w, errs.WrapCode(err, errs.FailedPrecondition, "unable to submit file for transcription"))
		return
	}

	if err = insert(ctx, *transcript.ID, fHeader.Filename, string(transcript.Status)); err != nil {
		errs.HTTPError(w, errs.WrapCode(err, errs.FailedPrecondition, "unable to store transcription"))
		return
	}
}

type AssemblyAIWebhookRequest struct {
	// Used to authenticated the webhook delivery. Must match the auth header
	// name used when creating the transcript.
	Secret string `header:"X-Webhook-Secret" encore:"sensitive"`

	// ID of the updated transcript.
	TranscriptID string `json:"transcript_id"`

	// Status of the updated transcript. Either "completed" or "error".
	Status string `json:"status"`
}

// Validate is run by Encore.dev before the request reaches the handler.
func (req *AssemblyAIWebhookRequest) Validate() error {
	if req.Secret != secrets.AssemblyAIWebhookSecret {
		return &errs.Error{
			Message: "unable to process webhook",
			Code:    errs.Unauthenticated,
		}
	}

	return nil
}

// Webhook handles webhook deliveries from AssemblyAI. AssemblyAI attempts to
// redeliver the message until the handler responds with a successful status
// code.
//
//encore:api public method=POST path=/api/webhook
func Webhook(ctx context.Context, req *AssemblyAIWebhookRequest) error {
	ctxlog := rlog.With("transcript_id", req.TranscriptID, "status", req.Status)

	if err := SyncTranscript(ctx, req.TranscriptID); err != nil {
		// Log the error details instead of sending them back to AssemblyAI.
		ctxlog.Error("unable to sync transcript", "error", err)

		// If we return a non-successful status code, AssemblyAI will attempt to
		// resend the webhook delivery.
		return &errs.Error{Code: errs.Unavailable}
	}

	return nil
}

//encore:api public method=POST path=/api/transcripts/:id/sync
func SyncTranscript(ctx context.Context, id string) error {
	transcript, err := getClient().Transcripts.Get(ctx, id)
	if err != nil {
		return errs.WrapCode(err, errs.Unavailable, "unable to get transcript")
	}

	b, _ := json.Marshal(transcript)

	if err := update(ctx, id, string(transcript.Status), b); err != nil {
		return errs.WrapCode(err, errs.Unavailable, "unable to store transcript")
	}

	return err
}

// Utterance is a continuous piece of speech by a single speaker.
type Utterance struct {
	Speaker string `json:"speaker,omitempty"`
	Text    string `json:"text,omitempty"`

	// Milliseconds since the beginning of the audio.
	StartMilliseconds int64 `json:"start,omitempty"`
}

type GetTranscriptResponse struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Status      string    `json:"status"`
	SubmittedAt time.Time `json:"submitted_at"`

	Utterances []Utterance `json:"utterances,omitempty"`
}

//encore:api public method=GET path=/api/transcripts/:id
func GetTranscript(ctx context.Context, id string) (*GetTranscriptResponse, error) {
	var res GetTranscriptResponse
	var raw sql.Null[[]byte]

	if err := db.QueryRow(ctx, `SELECT id, name, status, submitted_at, raw_transcript FROM transcripts WHERE id = $1`, id).Scan(
		&res.ID, &res.Name, &res.Status, &res.SubmittedAt, &raw,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, &errs.Error{
				Code:    errs.NotFound,
				Message: "transcript not found",
			}
		}
		return nil, err
	}

	// If we've received the completed transcript, we can start building the
	// response to send to the frontend.
	if raw.Valid {
		var transcript aai.Transcript

		if err := json.Unmarshal(raw.V, &transcript); err != nil {
			return nil, err
		}

		var utterances []Utterance

		for _, utt := range transcript.Utterances {
			utterances = append(utterances, Utterance{
				Speaker:           aai.ToString(utt.Speaker),
				StartMilliseconds: aai.ToInt64(utt.Start),
				Text:              aai.ToString(utt.Text),
			})
		}

		res.Utterances = utterances
	}

	return &res, nil
}

// Transcription represents a transcription job.
type Transcription struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Status      string    `json:"status"`
	SubmittedAt time.Time `json:"submitted_at"`
}

type GetTranscriptionsResponse struct {
	Transcriptions []Transcription `json:"transcriptions,omitempty"`
}

// GetTranscripts lists all the registered transcriptions.
//
//encore:api public method=GET path=/api/transcripts
func GetTranscriptions(ctx context.Context) (*GetTranscriptionsResponse, error) {
	transcription, err := list(ctx)
	if err != nil {
		return nil, errs.WrapCode(err, errs.Internal, "unable to get transcriptions")
	}

	return &GetTranscriptionsResponse{
		Transcriptions: transcription,
	}, nil
}

// getClient returns an authenticated AssemblyAI client.
func getClient() *aai.Client {
	return aai.NewClientWithOptions(
		aai.WithAPIKey(secrets.AssemblyAIAPIKey),
	)
}

func newTranscriptParams() *aai.TranscriptOptionalParams {
	params := &aai.TranscriptOptionalParams{
		// Enables Speaker Diarization.
		SpeakerLabels: aai.Bool(true),
	}

	// AssemblyAI won't be able to send a webhook delivery when we're running
	// locally, so let's disable it unless we're running in the cloud.
	if cfg.UseWebhook() {
		url := encore.Meta().APIBaseURL.ResolveReference(&url.URL{Path: "/api/transcripts/webhook"})

		params.WebhookURL = aai.String(url.String())
		params.WebhookAuthHeaderName = aai.String("X-Webhook-Secret")
		params.WebhookAuthHeaderValue = aai.String(secrets.AssemblyAIWebhookSecret)
	}

	return params
}
