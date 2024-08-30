import { describe, expect, test } from "vitest";
import request from "supertest";
import express from "express";
import getRequestExample from "../get-request-example";

/**
 * This test suite demonstrates how to test an Express route.
 * We have added the supertest library to make fake HTTP requests to the Express app without having to
 * start the server. We also use the vitest library to write tests.
 */
describe("Express App", () => {
  const app = express();
  app.use("/", getRequestExample);

  test("should respond with a greeting message", async () => {
    const response = await request(app).get("/hello/John");
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("message");
    expect(response.body.message).to.equal("Hello John!");
  });
});
