import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Client, { Local } from "./client.ts";
import { ClientContext } from "./ClientContext.ts";

const env = import.meta.env.DEV ? Local : window.location.origin;

const client = new Client(env);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClientContext.Provider value={client}>
      <App />
    </ClientContext.Provider>
  </React.StrictMode>,
);
