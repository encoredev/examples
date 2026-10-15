import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { ErrCode, type monitor, type site } from "./lib/client";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const ListResponse: site.ListResponse = { sites: [{ id: 1, url: "test.dev" }] };
const StatusResponse: monitor.StatusResponse = {
  sites: { 1: { up: true, checked_at: new Date().toISOString() } },
};

// Fake API responses, keyed by "METHOD /path".
let routes: Record<string, () => Response>;

// The generated client captures `fetch` when it's imported, so replace it
// before any imports run.
const fetchMock = vi.hoisted(() => {
  const mock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input.toString());
    const route = routes[`${init?.method ?? "GET"} ${url.pathname}`];
    return route ? route() : new Response("not found", { status: 404 });
  });
  globalThis.fetch = mock;
  return mock;
});

const json =
  (body: unknown, status = 200) =>
  () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

const calls = (method: string, path: string) =>
  fetchMock.mock.calls.filter(
    ([input, init]) =>
      (init?.method ?? "GET") === method &&
      new URL(input.toString()).pathname === path,
  );

describe("App", () => {
  beforeEach(() => {
    routes = {
      "GET /site": json(ListResponse),
      "GET /status": json(StatusResponse),
      "POST /site": json({ id: 2, url: "another.com" }),
      "DELETE /site/1": json({}),
      "POST /check-all": json({}),
    };
  });

  afterEach(() => {
    queryClient.clear();
    fetchMock.mockClear();
  });

  it("renders sites and their status", async () => {
    render(<App />, { wrapper });

    expect(
      await screen.findByRole("link", { name: "test.dev" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Up")).toBeInTheDocument();
    expect(screen.getByText("1 site · 1 up · 0 down")).toBeInTheDocument();
  });

  it("renders API errors", async () => {
    routes["GET /site"] = json(
      { code: ErrCode.Unknown, message: "request failed" },
      500,
    );

    render(<App />, { wrapper });

    expect(await screen.findByText("request failed")).toBeInTheDocument();
  });

  it("adds a site", async () => {
    render(<App />, { wrapper });

    await userEvent.type(
      await screen.findByLabelText("Website URL"),
      "another.com",
    );
    await userEvent.click(screen.getByRole("button", { name: "Add website" }));

    const [[, init]] = calls("POST", "/site");
    expect(JSON.parse(init!.body as string)).toEqual({ url: "another.com" });
  });

  it("adds a suggested site when there are none", async () => {
    routes["GET /site"] = json({ sites: [] });

    render(<App />, { wrapper });
    await userEvent.click(
      await screen.findByRole("button", { name: "+ encore.dev" }),
    );

    const [[, init]] = calls("POST", "/site");
    expect(JSON.parse(init!.body as string)).toEqual({ url: "encore.dev" });
  });

  it("checks all sites", async () => {
    render(<App />, { wrapper });

    await userEvent.click(
      await screen.findByRole("button", { name: "Check all now" }),
    );

    expect(calls("POST", "/check-all")).toHaveLength(1);
  });

  it("removes a site", async () => {
    render(<App />, { wrapper });

    await userEvent.click(
      await screen.findByRole("button", { name: /Remove\s*test\.dev/ }),
    );

    expect(calls("DELETE", "/site/1")).toHaveLength(1);
  });
});
