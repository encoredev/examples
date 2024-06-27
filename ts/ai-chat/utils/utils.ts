import { IncomingMessage } from "http";

type Entry<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T]

export async function filterObject<T extends object>(
  obj: T,
  fn: (entry: Entry<T>) => Promise<boolean>
) {
  const rtn: Partial<T> = {}
  for (const [key, value] of Object.entries(obj) as Entry<T>[]) {
    if (await fn([key, value])) {
      rtn[key] = value
    }
  }
  return rtn
}

// Extract the body from an incoming request.
export function getJSONBody<T>(req: IncomingMessage): Promise<T> {
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