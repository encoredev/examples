import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("auth-token");
  return redirect("/");
}
