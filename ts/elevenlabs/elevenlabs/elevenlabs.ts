import { ElevenLabsClient } from "elevenlabs";
import { api } from "encore.dev/api";
import { IncomingMessage } from "node:http";
import { secret } from "encore.dev/config";
import { APICallMeta, currentRequest } from "encore.dev";

const elevenLabsAPIKey = secret("ElevenLabsAPIKey");

const elevenlabs = new ElevenLabsClient({
  apiKey: elevenLabsAPIKey(),
});

export const generateVoiceAudio = api.raw(
  { expose: true, path: "/generate", method: "POST" },
  async (req, resp) => {
    const { voice, text, voice_settings } = await getJSONBody<{
      text: string;
      voice: string;
      voice_settings: {
        stability?: number;
        similarity?: number;
        exaggeration?: number;
      };
    }>(req);

    resp.setHeader("Content-Type", "audio/mpeg");

    const audioStream = await elevenlabs.generate({
      stream: true,
      voice,
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: voice_settings.stability || 0.5,
        similarity_boost: voice_settings.similarity || 0.75,
        style: voice_settings.exaggeration || 0,
        use_speaker_boost: true,
      },
    });

    audioStream.on("error", console.error);

    audioStream.pipe(resp);

    req.on("close", () => {
      audioStream.destroy();
    });
  },
);

interface Voice {
  id: string;
  name: string;
  labels: any;
  preview_url: string;
}

export const getVoices = api(
  { expose: true, path: "/voices", method: "GET" },
  async (): Promise<{ voices: Voice[] }> => {
    const resp = await elevenlabs.voices.getAll();
    const voices: Voice[] = resp.voices.map((v) => ({
      id: v.voice_id,
      name: v.name || "",
      labels: v.labels || "",
      preview_url: v.preview_url || "",
    }));
    return { voices };
  },
);

interface History {
  history_item_id: string;
  voice_name: string;
  text: string;
}

export const getHistory = api(
  { expose: true, path: "/history", method: "GET" },
  async (): Promise<{ history: History[] }> => {
    const resp = await elevenlabs.history.getAll();
    const history: History[] = resp.history.map((h) => ({
      history_item_id: h.history_item_id,
      voice_name: h.voice_name || "",
      text: h.text || "",
    }));
    return { history };
  },
);

export const getHistoryItemAudio = api.raw(
  { expose: true, path: "/history/:id", method: "GET" },
  async (req, resp) => {
    const current = currentRequest() as APICallMeta;
    const { id } = current.pathParams;
    resp.setHeader("Content-Type", "audio/mpeg");
    const audioStream = await elevenlabs.history.getAudio(id);
    audioStream.on("error", console.error);
    audioStream.pipe(resp);
    req.on("close", () => {
      audioStream.destroy();
    });
  },
);

// Extract the body from an incoming request.
function getJSONBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve) => {
    const bodyParts: any[] = [];
    req
      .on("data", (chunk) => {
        bodyParts.push(chunk);
      })
      .on("end", () => {
        resolve(JSON.parse(Buffer.concat(bodyParts).toString()));
      });
  });
}
