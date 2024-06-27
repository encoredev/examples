import { secret } from "encore.dev/config";
import log  from "encore.dev/log";
import { appMeta } from "encore.dev";
import ngrok from "@ngrok/ngrok";

const ngrokToken = secret("NGrokToken")
const ngrokDomain = secret("NGrokDomain")

// This function returns the base URL of the API. It's using the appMeta apiBaseUrl unless we are running locally,
// in which case it uses ngrok to create a tunnel to the local server.
// This is required to allow webhooks from chat providers to reach the local server.
export const baseURL = await async function (): Promise<string>{
  const baseURL = appMeta().apiBaseUrl
  if (appMeta().environment.cloud !== "local") {
    // if we are not running locally, return the base URL
    return baseURL
  }
  if (!ngrokToken()) {
    log.info("NGrok token not set, using local URL")
    return baseURL
  }
  const listener = await ngrok.forward({
    addr: baseURL,
    authtoken: ngrokToken(),
    domain: ngrokDomain ? ngrokDomain() : undefined
  });
  log.info(`NGrok URL: ${listener.url()}`)
  return listener.url() || ""
}()