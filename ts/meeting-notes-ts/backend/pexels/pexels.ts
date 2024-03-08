import { secret } from "encore.dev/config";
import { api } from "encore.dev/api";
import { APIError } from "encore.dev/errs";

const pexelsApiKey = secret("PexelsApiKey");

interface SearchResponse {
  photos: {
    id: number;
    src: {
      medium: string;
      landscape: string;
    };
    alt: string;
  };
}

export const searchPhoto = api(
  { expose: true, method: "GET", path: "/images/:query" },
  async ({ query }: { query: string }): Promise<SearchResponse> => {
    const resp = await fetch(
      `https://api.pexels.com/v1/search?query=${query}`,
      {
        headers: {
          Authorization: pexelsApiKey(),
        },
      },
    );
    if (resp.status >= 400) {
      throw APIError.internal(`Pexels API error: ${resp.status}`);
    }
    const json = (await resp.json()) as any;
    return {
      photos: json.photos.map((photo: any) => ({
        id: photo.id,
        src: {
          medium: photo.src.medium,
          landscape: photo.src.landscape,
        },
        alt: photo.alt,
      })),
    };
  },
);
