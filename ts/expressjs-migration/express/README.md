# Express.js example

## Installation

Install the project dependencies including TypeScript and Nodemon:

```
npm i
```

## Running locally

For development purposes, you can run the application using Nodemon to automatically restart the server when changes are detected. Execute the following command:

```
npm run dev
```

This will start the server at `http://localhost:3000` by default. You can change the port in the `src/index.ts` file.

## Docker for the database

This project uses a PostgreSQL database. You can initialize a PostgreSQL database using Docker with the following command:

```
npm run db:up
```

This requires that you have Docker installed on your machine.

## Testing

```bash
npm test
```
