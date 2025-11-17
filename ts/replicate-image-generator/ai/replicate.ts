import Replicate from "replicate";
import { secret } from "encore.dev/config";

const replicateToken = secret("ReplicateToken");

export const replicate = new Replicate({
  auth: replicateToken(),
});

