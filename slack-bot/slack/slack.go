// Service slack implements a cowsaw Slack bot.
package slack

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"encore.dev/beta/errs"
)

// This uses Encore's built-in secrets manager, learn more: https://encore.dev/docs/primitives/secrets
var secrets struct {
	SlackSigningSecret string
}

// cowart is the formatting string for printing the cow art.
const cowart = `
 ________________________________________
< %- 38s >
 ----------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
`

//encore:api public raw path=/cowsay
func Cowsay(w http.ResponseWriter, req *http.Request) {
	body, err := verifyRequest(req)
	if err != nil {
		errs.HTTPError(w, err)
		return
	}
	q, _ := url.ParseQuery(string(body))
	text := q.Get("text")
	data, _ := json.Marshal(map[string]string{
		"response_type": "in_channel",
		"text":          fmt.Sprintf(cowart, text),
	})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(data)
}

// verifyRequest verifies that a request is coming from Slack.
func verifyRequest(req *http.Request) (body []byte, err error) {
	eb := errs.B().Code(errs.InvalidArgument)
	body, err = ioutil.ReadAll(req.Body)
	if err != nil {
		return nil, eb.Cause(err).Err()
	}

	// Compare timestamps to prevent replay attack
	ts := req.Header.Get("X-Slack-Request-Timestamp")
	threshold := int64(5 * 60)
	n, _ := strconv.ParseInt(ts, 10, 64)
	if diff := time.Now().Unix() - n; diff > threshold || diff < -threshold {
		return body, eb.Msg("message not recent").Err()
	}

	// Compare HMAC signature
	sig := req.Header.Get("X-Slack-Signature")
	prefix := "v0="
	if !strings.HasPrefix(sig, prefix) {
		return body, eb.Msg("invalid signature").Err()
	}
	gotMac, _ := hex.DecodeString(sig[len(prefix):])

	mac := hmac.New(sha256.New, []byte(secrets.SlackSigningSecret))
	fmt.Fprintf(mac, "v0:%s:", ts)
	mac.Write(body)
	expectedMac := mac.Sum(nil)
	if !hmac.Equal(gotMac, expectedMac) {
		return body, eb.Msg("bad mac").Err()
	}
	return body, nil
}
