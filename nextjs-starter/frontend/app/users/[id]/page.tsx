import getRequestClient from "@/app/lib/getRequestClient";
import { APIError } from "@/app/lib/client";

export default async function UserDetails({
  params,
}: {
  params: { id: string };
}) {
  const client = getRequestClient();

  try {
    const response = await client.user.GetUser(params.id);
    return (
      <section>
        <h1>Detail for {response.user.name}</h1>
        <p>ID: {response.user.id}</p>
      </section>
    );
  } catch (err) {
    const apiError = err as APIError;
    return apiError.status === 401 ? (
      <section>
        <p>You need to login to view this data</p>
      </section>
    ) : (
      <p>Something went wrong!</p>
    );
  }
}
