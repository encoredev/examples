# {{name}}

A Slack bot that brings cowsay to Slack: the `/cowsay` slash command answers in the channel
with ASCII cow art saying whatever you typed. Every request is verified against your Slack
app's signing secret before it is answered, so only Slack can make the cow talk.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}` | Usage instructions. |
| `POST /{{name}}/cowsay` | The slash command's Request URL. Slack calls it with a form body; it answers `{"response_type": "in_channel", "text": "<cow art>"}`. A request without a valid `X-Slack-Signature`, or with an `X-Slack-Request-Timestamp` more than five minutes off, gets `401`. |

## Secrets

| Secret | Value |
| --- | --- |
| `SlackSigningSecret` | Your Slack app's **Signing Secret** (Your Apps → your app → Basic Information). |

It belongs to this service, so name the service when you set it. `encore secret set` reads
the value from stdin and stores it for this machine:

```bash
encore secret set --service {{name}} SlackSigningSecret
```

Until it is set, `/{{name}}/cowsay` answers `500`. The service reads the value it started
with, so a changed value takes effect when `encore run` restarts the service.

## Set up the Slack app

1. Create an app at [api.slack.com/apps](https://api.slack.com/apps), **from an app manifest**,
   in a workspace where you may install apps.
2. Use this manifest, with `https://YOUR-API-URL` replaced by where your app is reachable
   from the internet (Slack can't reach `localhost`; deploy it, or use a tunnel):

   ```yaml
   _metadata:
     major_version: 1
   display_information:
     name: Encore Bot
     description: Cowsay for the cloud age.
   features:
     slash_commands:
       - command: /cowsay
         url: https://YOUR-API-URL/{{name}}/cowsay
         description: Say things with a flair!
         usage_hint: your message here
         should_escape: false
     bot_user:
       display_name: encore-bot
       always_online: true
   oauth_config:
     scopes:
       bot:
         - commands
         - chat:write
         - chat:write.public
   settings:
     org_deploy_enabled: false
     socket_mode_enabled: false
     token_rotation_enabled: false
   ```

3. Copy the app's Signing Secret into `SlackSigningSecret` (above), install the app, and type
   `/cowsay Hello!` in a channel.

## Try it locally

With `encore run` running, sign a request the way Slack does (`v0=` and the hex
HMAC-SHA256 of `v0:<timestamp>:<body>`, keyed with the signing secret):

```bash
gw=http://localhost:4001   # the "gateway api" address encore run prints
secret='the value you set for SlackSigningSecret'
body='command=%2Fcowsay&text=Hello%21'
ts=$(date +%s)
sig="v0=$(printf 'v0:%s:%s' "$ts" "$body" | openssl dgst -sha256 -hmac "$secret" -hex | sed 's/^.* //')"

curl -s $gw/{{name}}/cowsay \
  -H "X-Slack-Request-Timestamp: $ts" -H "X-Slack-Signature: $sig" \
  --data "$body"
```

Change a byte of the body or the secret and it answers `401 signature mismatch`.
