# Firebase Auth + Encore App Example

This is an example of how to do user authentication using [Firebase Auth](https://firebase.google.com/docs/auth) together with an Encore app.
Check out the [Use Firebase with your app](https://encore.dev/docs/how-to/firebase-auth) guide to learn more about this example.

## Cloning the example

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone
this example by running this command:

```bash
encore app create my-app --example=firebase-auth
```

## Firebase Backend Credentials

Create a Firebase account if you haven't already. Then, create a new Firebase Project.

Then, go to **Project settings** and navigate to **Service accounts**.
Select `Go` as the language of choice and click `Generate new private key`.
Download the generated key and take note where it is stored.

Next, store the private key as your firebase secret.
From your terminal (inside your Encore app directory), run:

```shell
$ encore secret set --type prod FirebasePrivateKey < /path/to/firebase-private-key.json
Successfully updated production secret FirebasePrivateKey
```

Now you should do the same for the development secret. The most secure way is to
set up a different Firebase project and use that for development.

Depending on your security requirements you could also use the same Firebase project,
but we recommend generating a new private key for development in that case.

Once you have a private key for development, set it similarly to before:

```shell
$ encore secret set --type dev,local,pr FirebasePrivateKey < /path/to/firebase-private-key.json
Successfully updated development secret FirebasePrivateKey
```

## Firebase Frontend Credentials

On your Firebase Projects overview page, click on the circular button with the </> icon to configure your Firebase 
project for a web application. At the end of the flow you will be given a config object that looks like this:

```ts
const firebaseConfig = {
  apiKey: "AIzaSyDiUlY68W9Li_0EIkmdGdzD7nvqCT9kHnY",
  authDomain: "my-auth-test-fbd48.firebaseapp.com",
  projectId: "my-auth-test-fbd48",
  storageBucket: "my-auth-test-fbd48.appspot.com",
  messagingSenderId: "1078604952662",
  appId: "1:1078604952662:web:5d0b908439cfb5684ab7f7"
};
```

Replace the corresponding values in the `frontend/.env` file. 

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

Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.

### Encore's Local Development Dashboard

While `encore run` is running, open <http://localhost:9400/> to view Encore's local developer dashboard.
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

```
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
