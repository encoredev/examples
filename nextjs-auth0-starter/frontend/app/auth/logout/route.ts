import { cookies } from "next/headers";
import getRequestClient from "@/app/lib/getRequestClient";

export async function POST(req: Request) {


  try {
    const client = getRequestClient();
    const response = await client.auth.Logout();

    cookies().delete("auth-token");
    cookies().delete("state");

    return Response.redirect(response?.redirect_url);
  } catch (error) {
    console.error(error);
    return Response.redirect("http://localhost:3000/error");
  }
}
