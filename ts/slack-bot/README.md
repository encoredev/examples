# Slack Bot Starter

This is an Encore starter application for a Slack bot. It brings the greatness of the cowsay utility to Slack!

## Build from scratch with a tutorial

If you prefer to built it yourself, check out the [written tutorial](https://encore.dev/docs/ts/tutorials/slack-bot) to learn how to build this application from scratch.

## Prerequisites 

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`
  
**Slack Workspace:**
- You need to have a Slack Workspace where you are authorized to create Slack apps.

## Create app

Create a local app from this template:

```bash
encore app create my-app-name --example=ts/slack-bot
```

## Setup Slack integration

The first step is to create a new Slack app:
1. Head over to [Slack's API site](https://api.slack.com/apps) and create a new app.
2. When prompted, choose to create the app **from an app manifest**.
3. Choose a workspace to install the app in.

Enter the following manifest (replace `$APP_ID` in the URL below with your Encore app id):

```yaml
_metadata:
  major_version: 1
display_information:
  name: Encore Bot
  description: Cowsay for the cloud age.
features:
  slash_commands:
    - command: /cowsay
      # Replace $APP_ID below
      url: https://staging-$APP_ID.encr.app/cowsay
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

Next, head over to the configuration section for your Slack app (go to [Your Apps](https://api.slack.com/apps) &rarr; select your app &rarr; Basic Information).

Copy the **Signing Secret** and then run the following command and paste the secret to store it using Encore's built-in secrets manager:
```bash
 encore secret set --type local,dev,pr,prod SlackSigningSecret
```

## Run app locally

Run this command from your application's root folder:

```bash
encore run
```

**Note:** This app doesn't do much when running locally, you need to deploy it (see below) for Slack to be able to communicate with the program and for the bot to work.

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

Here you can see traces for all requests that you made while using the frontend, see your architecture diagram, and view API documentation in the Service Catalog.

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/ts/self-host/build) for how to use `encore build docker` to create a Docker image and configure it.

### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

## Link to GitHub

Follow these steps to link your app to GitHub:

1. Create a GitHub repo, commit and push the app.
2. Open your app in the [Cloud Dashboard](https://app.encore.dev).
3. Go to **Settings ➔ GitHub** and click on **Link app to GitHub** to link your app to GitHub and select the repo you just created.
4. To configure Encore to automatically trigger deploys when you push to a specific branch name, go to the **Overview** page for your intended environment. Click on **Settings** and then in the section **Branch Push** configure the **Branch name** and hit **Save**.
5. Commit and push a change to GitHub to trigger a deploy.

[Learn more in the docs](https://encore.dev/docs/platform/integrations/github)

## Testing

To run tests, configure the `test` command in your `package.json` to the test runner of your choice, and then use the command `encore test` from the CLI. The `encore test` command sets up all the necessary infrastructure in test mode before handing over to the test runner. [Learn more](https://encore.dev/docs/ts/develop/testing)

```bash
encore test
```