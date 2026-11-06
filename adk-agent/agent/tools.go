package agent

import (
	"encore.app/notes"
	"encore.dev/beta/errs"
	"google.golang.org/adk/v2/agent"
	"google.golang.org/adk/v2/tool"
	"google.golang.org/adk/v2/tool/functiontool"
)

type addNoteArgs struct {
	Text string `json:"text" jsonschema:"the note to save"`
}

type addNoteResult struct {
	ID    int64  `json:"id,omitempty"`
	Text  string `json:"text,omitempty"`
	Error string `json:"error,omitempty"`
}

type listNotesArgs struct{}

type listNotesResult struct {
	Notes []string `json:"notes"`
}

// noteTools wraps the notes service's typed Encore APIs as ADK function tools.
func noteTools() ([]tool.Tool, error) {
	add, err := functiontool.New(functiontool.Config{
		Name:        "add_note",
		Description: "Save a short note for the user.",
	}, func(ctx agent.Context, args addNoteArgs) (addNoteResult, error) {
		n, err := notes.Create(ctx, &notes.CreateParams{Text: args.Text})
		if c := errs.Code(err); c == errs.InvalidArgument || c == errs.ResourceExhausted {
			// Return validation errors to the model so it can tell the user.
			return addNoteResult{Error: errs.Convert(err).(*errs.Error).Message}, nil
		} else if err != nil {
			return addNoteResult{}, err
		}
		return addNoteResult{ID: n.ID, Text: n.Text}, nil
	})
	if err != nil {
		return nil, err
	}
	list, err := functiontool.New(functiontool.Config{
		Name:        "list_notes",
		Description: "List the user's saved notes, newest first.",
	}, func(ctx agent.Context, _ listNotesArgs) (listNotesResult, error) {
		resp, err := notes.List(ctx)
		if err != nil {
			return listNotesResult{}, err
		}
		out := listNotesResult{Notes: []string{}}
		for _, n := range resp.Notes {
			out.Notes = append(out.Notes, n.Text)
		}
		return out, nil
	})
	if err != nil {
		return nil, err
	}
	return []tool.Tool{add, list}, nil
}
