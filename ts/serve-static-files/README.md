# Serving static files example

Example utilizing a Raw endpoint to serve static files. This example uses the libs `finalhandler` and `serve-static` (same libs that Express.js uses) to serve static files. 

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create --example=ts/serve-static-files
```

## Running locally
```bash
encore run
```

## Test the endpoints

Go to [http://localhost:4000](http://localhost:4000) or [http://localhost:4000/public](http://localhost:4000/public) to see the static HTML response.

## Deployment

When having static files in your repo you need to make sure you have set `bundle_source` to `true` in your `encore.app` file, like so:

```json
{
  "build": {
    "docker": {
      "bundle_source": true
    }
  }
}
```

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
encore test
```
