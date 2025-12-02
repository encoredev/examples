import { Daytona } from "@daytonaio/sdk";
import { secret } from "encore.dev/config";

const daytonaApiKey = secret("DaytonaApiKey");

export const daytona = new Daytona({
  apiKey: daytonaApiKey(),
});

