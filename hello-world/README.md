<img width="200px" src="https://encore.dev/assets/branding/logo/logo.svg" alt="Encore - The Backend Development Engine" />

# Hello World

This is a basic Hello World Encore application with a single API endpoint

## Developing locally

When you have installed Encore, you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=hello-world
```


## Running

```bash
# Run the app
encore run
```

## Using the API

To see that your app is running, you can ping the API.

```bash
curl http://localhost:4000/hello/World
```

## Open the developer dashboard

While `encore run` is running, open <http://localhost:4000/> to view Encore's local developer dashboard.

## Deployment

Deploy your application to a staging environment in Encore's free development cloud.

```bash
git push encore
```

Then head over to <https://app.encore.dev> to find out your production URL, and off you go into the clouds!

## Testing

```bash
encore test ./...
```