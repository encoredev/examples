import getRequestClient from "@/app/lib/getRequestClient";
import { APIError } from "@/app/lib/client";

export default async function UserDetails({
  params,
}: {
  params: { id: string };
}) {
  const client = getRequestClient();
  const response = await client.user.GetUser(params.id);

  return (
    <section>
      <h1>Detail for {response.user.name}</h1>
      <p>ID: {response.user.id}</p>
    </section>
  );
}
