import { Resend } from "resend";
import { secret } from "encore.dev/config";

const resendApiKey = secret("ResendApiKey");

export const resend = new Resend(resendApiKey());

