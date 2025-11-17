import { Bucket } from "encore.dev/storage/objects";

export const images = new Bucket("generated-images", {
  public: true, // Make images publicly accessible
});

