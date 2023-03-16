<img width="200px" src="https://encore.dev/assets/branding/logo/logo.svg" alt="Encore - The Backend Development Engine" />

# Slack Bot

This is an example Encore application for a Slack bot. It brings the greatness of the cowsay utility to Slack!

## Tutorial

Check out the [written tutorial](https://encore.dev/docs/tutorials/slack-bot) to learn how to build this application from scratch!

## Developing locally

When you have installed Encore, you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=slack-bot
```

## Running

```bash
# To use the Slack integration, set the Slack signing secret (see tutorial above).
encore secret set SlackSigningSecret

# Run the app
encore run
```

## Open the developer dashboard

While `encore run` is running, open <http://localhost:4000/> to view Encore's local developer dashboard.
Here you can see the request you just made and a view a trace of the response.

## Deployment

Deploy your application to a staging environment in Encore's free development cloud.

```bash
git push encore
```

Then head over to <https://app.encore.dev> to find out your production URL, and off you go into the clouds!
