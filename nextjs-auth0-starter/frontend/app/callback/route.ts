import {cookies} from "next/headers";
import getRequestClient from "@/app/lib/getRequestClient";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);

    const state = searchParams.get("state");

    if (typeof state !== "string") {
        return Response.redirect("http://localhost:3000/error");
    }
    if (state != cookies().get("state")?.value) {
        return Response.redirect("http://localhost:3000/error");
    }

    const code = searchParams.get("code");
    if (typeof code !== "string") {
        return Response.redirect("http://localhost:3000/error");
    }

    try {
        const client = getRequestClient();
        const response = await client.auth.Callback({
            code: code,
        });
        cookies().set("auth-token", response.token);
        return Response.redirect("http://localhost:3000/users");
    } catch (error) {
        console.error(error);
        return Response.redirect("http://localhost:3000/error");
    }
}