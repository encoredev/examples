// Package elevenlabs is used for handling communication with generative voice AI from https://elevenlabs.io/
package elevenlabs

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/haguro/elevenlabs-go"
)

const MODEL_ID = "eleven_multilingual_v2" // AI models described here: https://docs.elevenlabs.io/speech-synthesis/models
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"   // Get other voice IDs here: https://docs.elevenlabs.io/api-reference/voices

// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/primitives/secrets
var secrets struct {
	ElevenLabsAPIKey string
}

func getTextToSpeech(text string) ([]byte, error) {
	// Create a new client
	reqTimeout := 30 * time.Second
	client := elevenlabs.NewClient(context.Background(), secrets.ElevenLabsAPIKey, reqTimeout)

	// Create a TextToSpeechRequest
	ttsReq := elevenlabs.TextToSpeechRequest{
		Text:    text,
		ModelID: MODEL_ID,
	}

	// Call the TextToSpeech method on the client
	return client.TextToSpeech(VOICE_ID, ttsReq)
}

type SpeechRequest struct {
	Text string `json:"text"`
}

// ServeAudio generates audio from text and serves it as mpeg to the client.
//
//encore:api public raw path=/speech/serve
func ServeAudio(w http.ResponseWriter, req *http.Request) {
	var speechRequest SpeechRequest

	err := json.NewDecoder(req.Body).Decode(&speechRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	audio, err := getTextToSpeech(speechRequest.Text)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "audio/mpeg")
	_, err = w.Write(audio)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// DownloadAudio generates audio from text and saves the audio file as mp3 to disk.
//
//encore:api public method=POST path=/speech/download
func DownloadAudio(ctx context.Context, params *SpeechRequest) error {
	audio, err := getTextToSpeech(params.Text)
	if err != nil {
		return err
	}

	// Write the audio file bytes to disk
	if err := os.WriteFile("speech.mp3", audio, 0644); err != nil {
		return err
	}

	return nil
}

// StreamAudio generates audio from text and streams it as mpeg to the client.
//
//encore:api public raw path=/speech/stream
func StreamAudio(w http.ResponseWriter, req *http.Request) {
	message := `The concept of "flushing" typically applies to I/O buffers in many programming 
				languages, which store data temporarily in memory before writing it to a more permanent location
				like a file or a network connection. Flushing the buffer means writing all the buffered data
				immediately, even if the buffer isn't full.`

	// Create a new client
	reqTimeout := 1 * time.Minute
	client := elevenlabs.NewClient(context.Background(), secrets.ElevenLabsAPIKey, reqTimeout)

	// Create a TextToSpeechRequest
	ttsReq := elevenlabs.TextToSpeechRequest{
		Text:    message,
		ModelID: MODEL_ID,
	}

	w.Header().Add("Content-Type", "audio/mpeg")

	// Stream the audio to http.ResponseWriter
	err := client.TextToSpeechStream(w, VOICE_ID, ttsReq)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
