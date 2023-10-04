import { cookies } from "next/headers";
import getRequestClient from "@/app/lib/getRequestClient";

export async function POST(req: Request) {
  const data = await req.formData();
  const email = (data.get("email") as string) || "incognito";
  const password = (data.get("password") as string) || "password";

  try {
    const client = getRequestClient();
    const response = await client.auth.Login({ email, password });
    cookies().set("auth-token", response.token);
  } catch (error) {
    console.error(error);
  }

  return Response.redirect(new URL(req.url).origin);
}
