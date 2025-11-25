import { Bucket } from "encore.dev/storage/objects";

export const uploads = new Bucket("uploads", {
  public: false, // Files are private and require our API to download
});

