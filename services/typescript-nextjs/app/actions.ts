"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** The guestbook form's Server Action: it stores the entry on the server. */
export async function sign(form: FormData): Promise<void> {
  // Imported on first use: see "Building" in the README.
  const { addEntry } = await import("@/db");
  const result = await addEntry(String(form.get("name") ?? ""), String(form.get("message") ?? ""));
  if (typeof result === "string") {
    redirect(`/?error=${encodeURIComponent(result)}`);
  }
  revalidatePath("/");
  redirect("/");
}
