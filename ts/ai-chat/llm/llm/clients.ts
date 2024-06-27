import {LLMMessage, Meta} from "../provider/provider";
import {openai, claude} from "~encore/clients"
import { filterObject } from "../../utils/utils";

// Client interface for the LLM providers
interface Client {
  ask(req:{prompt: string}): Promise<{response:string}>
  generateAvatar?(req:{prompt: string}): Promise<{data:string}>
  chat(req:{system:string, messages:LLMMessage[], meta: Meta}): Promise<void>
  available(): Promise<{available:boolean}>
}

// All supported LLM providers
const allClients = {
  "openai": {
    ask: (...args) => openai.ask(...args),
    generateAvatar: (...args) => openai.generateAvatar(...args),
    chat: (...args) => openai.chat(...args),
    available: () => openai.available(),
  } as Client,
  "claude": {
    ask: (...args) => claude.ask(...args),
    chat: (...args) => claude.chat(...args),
    available: () => claude.available(),
  } as Client
}

// LLMType is used as a reference to which provider should be used.
export type LLMType = keyof typeof allClients

// availableClients is a map of the clients which responded as available to the available() function.
export let availableClients:Partial<typeof allClients>;

// This function initializes all the supported clients. It's called when the server starts and
// uses the available() function to check if the provider is available.
(async function initClients(): Promise<Partial<typeof allClients>> {
  return filterObject(allClients,  ([provider, client]) => {
    return client.available().then(({available}) => available)
  })
})().then((r) => availableClients = r)