import { Autumn } from "autumn-js";
import { secret } from "encore.dev/config";

const autumnSecretKey = secret("AutumnSecretKey");

export const autumn = new Autumn({
  secretKey: autumnSecretKey(),
});

