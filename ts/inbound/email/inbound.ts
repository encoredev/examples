import { Inbound } from "inboundemail";
import { secret } from "encore.dev/config";

const inboundApiKey = secret("InboundApiKey");

export const inbound = new Inbound(inboundApiKey());

