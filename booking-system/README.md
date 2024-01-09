# Booking System Example

The example in this starter is an Appointment Booking System with both a user facing part (finding and booking appointments) and a admin part (setting availability and managing scheduled appointments). 

When a new appointment is booked, the backend sends a confirmation email to the user (utilizing the [Sendgrid Encore Bit integration](https://github.com/encoredev/examples/tree/main/bits/sendgrid)).

It has a React frontend with both a user facing part and an admin dashboard. Authentication is required for accessing admin dashboard.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=booking-system
```

## Running locally

Run your application:
```bash
encore run
```

## Local Development Dashboard

While `encore run` is running, open <http://localhost:9400/> to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see API docs, make requests in the API explorer, and view traces of the responses.

## View the frontend

While `encore run` is running, head over to <http://localhost:4000/frontend/> to view the frontend for your booking system monitor.

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
