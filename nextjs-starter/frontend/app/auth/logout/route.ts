import { cookies } from "next/headers";

export async function POST(req: Request) {
  cookies().delete("auth-token");
  return Response.redirect(new URL(req.url).origin);
}
