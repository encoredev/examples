import { Resend } from "resend";
import { secret } from "encore.dev/config";

// Store your Resend API key as an Encore secret:
//   encore secret set --type dev,local,pr,production ResendAPIKey
const apiKey = secret("ResendAPIKey");

export const resend = new Resend(apiKey());
