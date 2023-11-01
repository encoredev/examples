import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC, PropsWithChildren } from "react";
import { APIError, ErrCode, monitor, site } from "./client";
import { userEvent } from "@testing-library/user-event";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const ListResponse: site.ListResponse = { sites: [{ id: 1, url: "test.dev" }] };
const StatusResponse: monitor.StatusResponse = {
  sites: {
    1: {
      up: true,
      checked_at: Date.now().toString(),
    },
  },
};

describe("App", () => {
  beforeEach(() => {
    jest
      .spyOn(site.ServiceClient.prototype, "List")
      .mockReturnValue(Promise.resolve(ListResponse));

    jest
      .spyOn(monitor.ServiceClient.prototype, "Status")
      .mockReturnValue(Promise.resolve(StatusResponse));

    jest.spyOn(site.ServiceClient.prototype, "Add");
    jest.spyOn(site.ServiceClient.prototype, "Delete");
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("render sites", async () => {
    render(<App />, { wrapper });
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    expect(site.ServiceClient.prototype.List).toBeCalledTimes(1);
    expect(monitor.ServiceClient.prototype.Status).toBeCalledTimes(1);

    screen.getAllByText("test.dev");
    screen.getByText("Up");
  });

  it("render api error", async () => {
    jest.spyOn(site.ServiceClient.prototype, "List").mockReturnValue(
      Promise.reject(
        new APIError(500, {
          code: ErrCode.Unknown,
          message: "request failed",
        }),
      ),
    );

    render(<App />, { wrapper });
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    screen.getAllByText("request failed");
  });

  it("add site", async () => {
    render(<App />, { wrapper });
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    await userEvent.click(screen.getByText("Add website"));

    await userEvent.type(
      screen.getByPlaceholderText("google.com"),
      "another.com",
    );

    await userEvent.click(screen.getByText("Save"));

    expect(site.ServiceClient.prototype.Add).toHaveBeenCalledWith({
      url: "another.com",
    });
  });

  it("delete site", async () => {
    render(<App />, { wrapper });
    await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

    await userEvent.click(screen.getByText("Delete"));

    expect(site.ServiceClient.prototype.Delete).toHaveBeenCalledWith(1);
  });
});
