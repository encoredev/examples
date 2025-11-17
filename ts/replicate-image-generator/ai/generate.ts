import { api } from "encore.dev/api";
import { replicate } from "./replicate";
import { images } from "./storage";

interface GenerateImageRequest {
  prompt: string;
  model?: "flux" | "stable-diffusion";
  aspectRatio?: "1:1" | "16:9" | "9:16";
}

interface GenerateImageResponse {
  id: string;
  status: string;
  output?: string[];
}

export const generateImage = api(
  { expose: true, method: "POST", path: "/ai/generate" },
  async (req: GenerateImageRequest): Promise<GenerateImageResponse> => {
    // Choose model based on request
    const modelVersion = req.model === "stable-diffusion" 
      ? "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
      : "black-forest-labs/flux-schnell";

    const input: any = {
      prompt: req.prompt,
    };

    // FLUX-specific parameters
    if (req.model !== "stable-diffusion") {
      input.aspect_ratio = req.aspectRatio || "1:1";
      input.num_outputs = 1;
    }

    const prediction = await replicate.predictions.create({
      version: modelVersion,
      input,
    });

    return {
      id: prediction.id,
      status: prediction.status,
      output: prediction.output as string[] | undefined,
    };
  }
);

interface PredictionStatusRequest {
  id: string;
}

interface PredictionStatusResponse {
  id: string;
  status: string;
  output?: string[];
  error?: string;
}

export const getPredictionStatus = api(
  { expose: true, method: "GET", path: "/ai/predictions/:id" },
  async ({ id }: PredictionStatusRequest): Promise<PredictionStatusResponse> => {
    const prediction = await replicate.predictions.get(id);

    return {
      id: prediction.id,
      status: prediction.status,
      output: prediction.output as string[] | undefined,
      error: prediction.error ? String(prediction.error) : undefined,
    };
  }
);

interface SaveImageRequest {
  predictionId: string;
  imageUrl: string;
}

interface SaveImageResponse {
  url: string;
  key: string;
}

export const saveImage = api(
  { expose: true, method: "POST", path: "/ai/save-image" },
  async (req: SaveImageRequest): Promise<SaveImageResponse> => {
    // Download image from Replicate
    const response = await fetch(req.imageUrl);
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Generate unique key
    const key = `${req.predictionId}-${Date.now()}.png`;

    // Upload to Encore's object storage
    await images.upload(key, imageBuffer, {
      contentType: "image/png",
    });

    // Get public URL
    const publicUrl = await images.publicUrl(key);

    return {
      url: publicUrl,
      key,
    };
  }
);

