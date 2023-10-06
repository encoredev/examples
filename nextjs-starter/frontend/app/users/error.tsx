"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  if (error.message === "invalid auth param") {
    return <p>You need to login to view this data</p>;
  }

  return <p>Something went wrong!</p>;
}
