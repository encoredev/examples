import Client from "./client.ts";
import React from "react";

export const ClientContext = React.createContext<Client>({} as Client);
