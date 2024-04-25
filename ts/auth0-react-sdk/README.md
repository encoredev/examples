# Auth0 React SDK + Encore App Example

This is an example of how to do user authentication using [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react) together with an Encore app.

For this example the login/logout flow is abstracted away by the Auth0 React SDK, then in the Encore auth handler the JWT token is verified and the user is authenticated.
You an also take a look at [auth0](https://github.com/encoredev/examples/blob/main/auth0) for an example where the login/logout flow is done through Encore and the frontend is React + React Router.

## Cloning the example

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone
this example by running this command:

```bash
encore app create my-app --example=ts/auth0-react-sdk
```

## Auth0 Credentials

Create an Auth0 account if you haven't already. Then, in the Auth0 dashboard, create a new *Single Page Web Applications*.

Next, go to the *Application Settings* section. There you will find the `Domain` and `Client ID` that you need to communicate with Auth0. 
Copy these values, we will need them shortly.

A callback URL is where Auth0 redirects the user after they have been authenticated. Add `http://localhost:3000` to the *Allowed Callback URLs*. 
You will need to add more URLs to this list when you have a production or staging environments. 

The same goes for the logout URL (were the user will get redirected after logout). Add `http://localhost:3000` to the *Allowed Logout URLs*.

Add `http://localhost:3000` to the *Allowed Web Origins*.

Click the *Advanced Settings* at the bottom of the page and go to the *Certificates* tab. Download the PEM certificate.

Next in the Auth0 dashboard, go to the *APIs* page.

Create a new API, give it a name and an identifier. When the API is created, copy the `API Audeience`URL.

### Config values

In `backend/auth/config.ts`, replace the values for the `Domain` and `Audience` that you got from the Auth0 dashboard.

In `frontend/.env` file, replace the values for `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` that you got from the Auth0 dashboard.

Set the PEM certificate as an Encore secret. From your terminal (inside your Encore app directory), run:

```bash
$ encore-beta secret set --dev Auth0PEMCertificate < your-downloaded-cert.pem
```

## Developing locally

Run your Encore backend:

```bash
encore run
```

### Encore's Local Development Dashboard

While `encore run` is running, open <http://localhost:9400/> to view Encore's local developer dashboard.
Here you can see the request you just made and a view a trace of the response.


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
