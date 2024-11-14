import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import getRequestClient from "../../lib/getRequestClient";

export async function POST(req: Request) {
  const data = await req.formData();
  const email = (data.get("email") as string) || "incognito";
  const password = (data.get("password") as string) || "password";

  try {
    const client = await getRequestClient();
    const response = await client.api.login({ email, password });
    (await cookies()).set("auth-token", response.token);
  } catch (error) {
    console.error("Error logging in", error);
  }

  return redirect("/");
}
