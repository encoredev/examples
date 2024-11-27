# Clerk React SDK + Encore App Example

This is an example of how to do user authentication using [Clerk](https://clerk.com/) together with an Encore app.
Check out the [Use Clerk with your app](https://encore.dev/docs/ts/how-to/clerk-auth) guide to learn more about this example.

## Cloning the example

### Prerequisite: Installing Encore

If this is the first time you're using Encore, you first need to install the CLI that runs the local development
environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

When you have installed Encore, run to clone this example:

```bash
encore app create my-app --example=ts/clerk
```

## Clerk Credentials

1. Create a Clerk account if you haven't already. Then, in the Clerk dashboard, create a new application.

2. Go to the *API Keys* page for your app. Copy the "Publishable Key" and one of the "Secret keys".

3. In `frontend/.env` file, replace the values for `VITE_CLERK_PUBLISHABLE_KEY` with the value from your Clerk dashboard.

4. The `Secret key` is sensitive and should not be hardcoded in your code/config. Instead, you should store that as an [Encore secret](https://encore.dev/docs/ts/primitives/secrets).

From your terminal (inside your Encore app directory), run:

```shell
$ encore secret set --prod ClerkSecretKey
```

5. Do the same for the development secret. The most secure way is to create another secret key (Clerk allows you to have multiple).
Once you have a client secret for development, set it similarly to before:

```shell
$ encore secret set --dev ClerkSecretKey
```

6. Go the *Domains* page for your app in the Clerk dashboard. There you will find the domain for your app. Replace the value for the `DOMAIN` variable in `auth/config.ts` with your domain.

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

### Encore Backend

#### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/ts/self-host/build) for how to use `encore build docker` to create a Docker image and configure it.

#### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

#### Link to GitHub

Follow these steps to link your app to GitHub:

1. Create a GitHub repo, commit and push the app.
2. Open your app in the [Cloud Dashboard](https://app.encore.dev).
3. Go to **Settings ➔ GitHub** and click on **Link app to GitHub** to link your app to GitHub and select the repo you just created.
4. To configure Encore to automatically trigger deploys when you push to a specific branch name, go to the **Overview** page for your intended environment. Click on **Settings** and then in the section **Branch Push** configure the **Branch name** and hit **Save**.
5. Commit and push a change to GitHub to trigger a deploy.

[Learn more in the docs](https://encore.dev/docs/platform/integrations/github)

### React frontend

#### Vercel

The frontend can be deployed to Vercel. Follow these steps:

1. Create a repo and push the project to GitHub.
2. Create a new project on Vercel and point it to your GitHup repo.
3. Select `frontend` as the root directory for the Vercel project.

Once you have your frontend deployed:
* Update the `AUTHORIZED_PARTIES` array in `auth/config.ts` to include the deployed Vercel URL. 
* Set the `allow_origins_with_credentials` in the `encore.app` (see below) file to the deployed Vercel URL.


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
