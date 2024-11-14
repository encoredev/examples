"use client";

import { useSearchParams } from "next/navigation";

export default function Unauthenticated() {
  const searchParams = useSearchParams();
  const fromPage = searchParams.get("from");

  return (
    <section>
      <h1 className="text-3xl">Unauthenticated</h1>
      <br />
      <p>
        You need to be logged in to view <code>{fromPage}</code>
      </p>
    </section>
  );
}
