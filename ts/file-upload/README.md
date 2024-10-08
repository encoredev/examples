# Handling file uploads example

This example utilizes a Raw endpoint to handle file uploads. This example uses the [busboy](https://www.npmjs.com/package/busboy) library to help with the file handling. 

**Endpoints:**

* `/upload` (POST) - Single file upload, storing file as bytes in database
* `/upload-multiple` (POST) - Multiple files upload, storing files as bytes in database
* `/files/:name` (GET) - Get a files content by it's name
* `/files` (GET) - Get a list of file names that is stored in the database 
* `/` (GET) - Example frontend for testing the file upload

## Developing locally

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run:

```bash
encore app create --example=ts/file-upload
```

## Running locally

Before running your application, make sure you have Docker installed and running. It's required to locally run Encore applications with databases.

```bash
encore run
```

Go to [http://localhost:4000](http://localhost:4000) in the browser to see the example frontend.

You can also access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash) on <http://localhost:9400/> to view traces, API documentation, and more.

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
encore test
```
