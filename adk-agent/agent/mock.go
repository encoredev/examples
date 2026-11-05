package agent

import (
	"context"
	"fmt"
	"iter"
	"strings"

	"google.golang.org/adk/v2/model"
	"google.golang.org/genai"
)

// mockLLM implements model.LLM without network access so the app runs with no key.
// It calls the note tools on simple keywords and otherwise echoes.
type mockLLM struct{}

func (mockLLM) Name() string { return "mock" }

func (mockLLM) GenerateContent(ctx context.Context, req *model.LLMRequest, stream bool) iter.Seq2[*model.LLMResponse, error] {
	return func(yield func(*model.LLMResponse, error) bool) {
		var last *genai.Content
		if n := len(req.Contents); n > 0 {
			last = req.Contents[n-1]
		}
		if last == nil || len(last.Parts) == 0 {
			yield(textResp("Mock mode."), nil)
			return
		}
		p := last.Parts[0]
		switch {
		case p.FunctionResponse != nil:
			reply := fmt.Sprintf("Saved: %v", p.FunctionResponse.Response["text"])
			if e, ok := p.FunctionResponse.Response["error"]; ok {
				reply = fmt.Sprintf("Could not save: %v", e)
			} else if p.FunctionResponse.Name == "list_notes" {
				reply = formatNotes(p.FunctionResponse.Response)
			}
			emit(yield, reply, stream)
		case strings.HasPrefix(strings.ToLower(p.Text), "note:"):
			call(yield, "add_note", map[string]any{"text": strings.TrimSpace(p.Text[5:])})
		case strings.Contains(strings.ToLower(p.Text), "notes"):
			call(yield, "list_notes", map[string]any{})
		default:
			emit(yield, "Mock mode, no model key set. Try \"note: buy milk\" or \"list my notes\". You said: "+p.Text, stream)
		}
	}
}

func textResp(s string) *model.LLMResponse {
	return &model.LLMResponse{Content: genai.NewContentFromText(s, genai.RoleModel), TurnComplete: true}
}

func call(yield func(*model.LLMResponse, error) bool, name string, args map[string]any) {
	yield(&model.LLMResponse{
		Content:      &genai.Content{Role: genai.RoleModel, Parts: []*genai.Part{genai.NewPartFromFunctionCall(name, args)}},
		TurnComplete: true,
	}, nil)
}

func emit(yield func(*model.LLMResponse, error) bool, s string, stream bool) {
	if stream {
		for _, w := range strings.SplitAfter(s, " ") {
			r := &model.LLMResponse{Content: genai.NewContentFromText(w, genai.RoleModel), Partial: true}
			if !yield(r, nil) {
				return
			}
		}
	}
	yield(textResp(s), nil)
}

func formatNotes(resp map[string]any) string {
	notes, _ := resp["notes"].([]any)
	if len(notes) == 0 {
		return "No notes yet."
	}
	var b strings.Builder
	b.WriteString("Your notes:")
	for _, n := range notes {
		fmt.Fprintf(&b, "\n- %v", n)
	}
	return b.String()
}
