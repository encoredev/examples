# GPT Functions with Encore

This is an example of using ChatGPT Functions with Encore.

ChatGPT functions allow developers to embed functions directly into the system prompt when interacting with the AI
model. Function calling opens up several use cases, including:

* Creating chatbots that leverage external/internal APIs
* Converting natural language into API calls
* Extracting structured data from text

In this example we are feeding in Encore APIs as the functions to the model. Because we are using Encore APIs we can see
exactly which functions the model called in the generated trace data.

The `gpt` endpoint is this example could be interesting both for customers and for internal use. Customers could use it
with prompts like "Recommend me a book that is similar to Kill a Mockingbird". For internal use, it could be used to
quickly access data from the database with prompts like "Give me the book with the id of a1".

Example prompts:

- Recommend me a book that is similar to Kill a Mockingbird
- Give me the book with the id of a1
- List all historical books
- What is the book The Girl with the Dragon Tattoo about

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone
this example with this command.

```bash
encore app create gpt-functions-example --example=ts/gpt-functions
```

## Running locally

You need to supply an OpenAI API Key to run this example:

```bash
encore secret set OpenAIAPIKey
```

Then run your application:

```bash
encore run
```

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access
Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

You can make requests in the API explorer to the `book.gpt` endpoint to test the functionality.

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
