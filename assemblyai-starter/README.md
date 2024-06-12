# AssemblyAI Starter

This is an Encore starter for a Conversational Intelligence app that uses [AssemblyAI](https://assemblyai.com). It lets you upload and transcribe voice data.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=assemblyai-starter
```

## AssemblyAI API Key

You will need an [API key from AssemblyAI](https://www.assemblyai.com/dashboard/signup) to use this package. You can get one by signing up for a free account at https://assemblyai.com/.

Once you have the API key, set it as an Encore secret using the name `AssemblyAIAPIKey`:

```bash
$ encore secret set --type dev,prod,local,pr AssemblyAIAPIKey
Enter secret value: *****
Successfully updated development secret AssemblyAIAPIKey.
```

**Optional:** You can also enable [webhook authentication](https://www.assemblyai.com/docs/getting-started/webhooks#authenticate-webhook-deliveries) by setting the `AssemblyAIWebhookSecret`:

```bash
$ encore secret set --type dev,prod,local,pr AssemblyAIWebhookSecret
Enter secret value: *****
Successfully updated development secret AssemblyAIWebhookSecret.
```

## Running locally

Before running your application, make sure you have Docker installed and running. It's required to locally run Encore applications with databases.

```bash
encore run
```

While `encore run` is running, open <http://localhost:4000/frontend> to view the AssemblyAI playground frontend.

## Open the developer dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see API docs, make requests in the API explorer, and view traces of the responses.

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!

## Testing

```bash
encore test ./...
```
