# Supabase React SDK + Encore App Example

This is an example of how to implement user authentication using [Supabase](https://supabase.com/) together with an Encore app, and make a API call to an Encore backend!


## Cloning the example

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run to clone this example:

```bash
encore app create my-app --example=ts/supabase
```

## Supabase Credentials

1. Create a Supabase account if you haven't already. Then, create a new project in the Supabase dashboard.

2. Go to the *Project Settings* > *API* page for your project. Copy the "Project URL" and "Project API Key".

3. In `frontend/.env` file, replace the values for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values from your Supabase dashboard.

4. The `service_role` is sensitive and should not be hardcoded in your code/config. Instead, you should store that as an [Encore secret](https://encore.dev/docs/ts/primitives/secrets).

From your terminal (inside your Encore app directory), run:

```shell
$ encore secret set SUPABASE_KEY --type prod,dev,local
```
NOTE: This will use the same `service_role` for both development and production environments. You might want to create separate Supabase project for your different environments. 

5. We also need to set the "Project URL" (same as above) as an Encore secret to be able to access it in our backend:

```shell
$ encore secret set SUPABASE_URL --type prod,dev,local
```


## Developing locally

Run your Encore backend:

```bash
encore run
```

In a different terminal window, run the React frontend using [Vite](https://vitejs.dev/):

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.

### Encore's Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's local developer dashboard.
Here you can see the request you just made and a view a trace of the response.

### Generating a request client

Keep the contract between the backend and frontend in sync by regenerating the request client whenever you make a change
to an Encore endpoint.

```bash
npm run gen # Locally running Encore backend
```

## Deployment

### Encore

Deploy your backend to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also see metrics, traces, connect your app to a
GitHub repo to get automatic deploys on new commits, and connect your own AWS or GCP account to use for deployment.

### React on Vercel

1. Create a repo and push the project to GitHub.
2. Create a new project on Vercel and point it to your GitHub repo.
3. Select `frontend` as the root directory for the Vercel project.

## CORS configuration

If you are running into CORS issues when calling your Encore API from your frontend then you may need to specify which
origins are allowed to access your API (via browsers). You do this by specifying the `global_cors` key in the `encore.app`
file, which has the following structure:

```js
global_cors: {
  // allow_origins_without_credentials specifies the allowed origins for requests
  // that don't include credentials. If nil it defaults to allowing all domains
  // (equivalent to ["*"]).
  "allow_origins_without_credentials": [
    "<ORIGIN-GOES-HERE>"
  ],
        
  // allow_origins_with_credentials specifies the allowed origins for requests
  // that include credentials. If a request is made from an Origin in this list
  // Encore responds with Access-Control-Allow-Origin: <Origin>.
  //
  // The URLs in this list may include wildcards (e.g. "https://*.example.com"
  // or "https://*-myapp.example.com").
  "allow_origins_with_credentials": [
    "<DOMAIN-GOES-HERE>"
  ]
}
```

More information on CORS configuration can be found here: https://encore.dev/docs/ts/develop/cors

## Author

This example was created by leofmarciano.
