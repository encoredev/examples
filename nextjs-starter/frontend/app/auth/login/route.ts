import { cookies } from "next/headers";
import getRequestClient from "@/app/lib/getRequestClient";
import { redirect } from "next/navigation";

export async function GET() {
  try {
    const client = getRequestClient();
    const response = await client.auth.Login({
      // email: "test@example.com",
      // password: "123abc",
    });
    cookies().set("auth-token", response.token);
  } catch (error) {}

  redirect("/");
}
