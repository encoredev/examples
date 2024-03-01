# Auth0 + React + Encore App Example

This is an example of how to do user authentication using [Auth0](https://auth0.com/) in an Encore app. 
Check out the [Use Auth0 with your app](https://encore.dev/docs/how-to/auth0-auth) guide to learn more about this example.

For this example the login/logout flow is done through Encore and the frontend is React + React Router.
Take a look at [auth0-react-sdk](https://github.com/encoredev/examples/blob/main/auth0-react-sdk) for an example where the login/logout flow is abstracted away by the Auth0 React SDK.

## Cloning the example

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone
this example by running this command:

```bash
encore app create my-app --example=auth0
```

## Auth0 Credentials

Create an Auth0 account if you haven't already. Then, in the Auth0 dashboard, create a new *Single Page Web Applications*.

Next, go to the *Application Settings* section. There you will find the `Domain`, `Client ID`, and `Client Secret` that you need to communicate with Auth0. 
Copy these values, we will need them shortly.

A callback URL is where Auth0 redirects the user after they have been authenticated. 
Add `http://localhost:3000/callback` to the *Allowed Callback URLs*. 
You will need to add more URLs to this list when you have a production or staging environments. 

The same goes for the logout URL (were the user will get redirected after logout). Add `http://localhost:3000/` to the *Allowed Logout URLs*.

### Config and secrets

In `backend/auth/auth-config.cue`, replace the values for the `ClientID` and `Domain` that you got from the Auth0 dashboard.

The `ClientSecret` is especially sensitive and should not be hardcoded in your code/config. Instead, you should store that as an [Encore secret](https://encore.dev/docs/primitives/secrets).

From your terminal (inside your Encore app directory), run:

```shell
$ encore secret set --prod Auth0ClientSecret
```

Now you should do the same for the development secret. The most secure way is to set up a different Auth0 application and use that for development.
Depending on your security requirements you could also use the same secret for development and production.

Once you have a client secret for development, set it similarly to before:

```shell
$ encore secret set --dev Auth0ClientSecret
```

## Developing locally

Run your Encore backend:

```bash
encore run
```

In a different terminal window, run the React frontend using [Vite](https://vitejs.dev/):

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Encore's Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to view Encore's local developer dashboard.
Here you can see the request you just made and a view a trace of the response.

### Generating a request client

Keep the contract between the backend and frontend in sync by regenerating the request client whenever you make a change
to an Encore endpoint.

```bash
npm run gen # Deployed Encore staging environment
# or
npm run gen:local # Locally running Encore backend
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
2. Create a new project on Vercel and point it to your GitHup repo.
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

More information on CORS configuration can be found here: https://encore.dev/docs/develop/cors
