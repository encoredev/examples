# Logto React SDK + Encore App Example

This is an example of how to do user authentication using [Logto](https://logto.io) together with an Encore app.

For this example the sign in / sing out flow is abstracted away by the Logto React SDK, then in the Encore auth handler the JWT token is verified and the user is authenticated.

## Prerequisites 

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

## Logto settings

Before we begin integrating with Encore, you'll need to set up a few things in Logto:

1. Create an account at [Logto Cloud](https://cloud.logto.io) if you don't have one yet.

2. Create an API Resource in Logto Console, this represents your Encore API service
   - Go to "API Resources" in Logto Console and create a new API
   - Set a name and API identifier (e.g., `https://api.encoreapp.com`)
   - Note down the API identifier on the API resource details page as we'll need it later
  
3. Create an application for your frontend application
   - Go to "Applications" in Logto Console
   - Create a new application according to your frontend framework (We use React as an example, but you can create any Single-Page Application (SPA) or native app)
   - Configure Redirect URIs for this example
     - Add `http://localhost:5173/callback` to the *Redirect URIs*
     - Add `http://localhost:5173` to the *Post Sign-out URIs*
   - Note down the `Logto endpoint`, `Issuer endpoint` and `App ID` on the Application details page in the "Endpoints & Credentials" section as we'll need them later


## Config values

Update the `backend/auth/auth-config.cue` file with the values you got in the Logto settings section.

Update the `frontend/src/config/logto.ts` file with the values you got in the Logto settings section. The `encoreApiEndpoint` will be `http://localhost:4000` in this example.

## Developing locally

Run your Encore backend:

```bash
encore run
```

The encore backend will be running at `http://localhost:4000`.

In a different terminal window, run the React frontend:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.


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

More information on CORS configuration can be found here: https://encore.dev/docs/go/develop/cors
