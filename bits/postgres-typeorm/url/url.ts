import { api, APIError } from "encore.dev/api";
import { randomBytes } from "node:crypto";
import { URLEntity } from "./url.entity";
import { initializeApp } from "./db";
import "reflect-metadata";

const db = await initializeApp();

interface URL {
    id: string; // short-form URL id
    url: string; // complete URL, in long form
}
interface AllURLs {
    urls: URL[]
}
interface ShortenParams {
    url: string; // the URL to shorten
}

// Shortens a URL.
export const shorten = api(
    { method: "POST", path: "/url", expose: true },
    async ({ url }: ShortenParams): Promise<URL> => {
        const id = randomBytes(6).toString("base64url");
        const results = await db.getRepository(URLEntity).save({ id, url })
        return { id, url };
    },
);

export const get = api(
    { method: "GET", path: "/url/:id", expose: true },
    async ({ id }: { id: string }): Promise<URL> => {
        const row = await db.getRepository(URLEntity).findOne({ where: { id }, select: ['url'] })
        if (!row) throw APIError.notFound("url not found");
        return { id, url: row.url };
    },
);

export const getAll = api(
    { method: "GET", path: "/urls", expose: true },
    async (): Promise<AllURLs> => {
        const rows = await db.getRepository(URLEntity).find()
        console.log("row=", rows)
        if (!rows) throw APIError.notFound("url not found");
        return { urls: rows }
    },
);