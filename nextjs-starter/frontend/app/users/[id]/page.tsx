import getRequestClient from "@/app/lib/getRequestClient";

export default async function UserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const client = await getRequestClient();
  const { id } = await params;
  const response = await client.user.GetUser(id);

  return (
    <section>
      <h1>Detail for {response.user.name}</h1>
      <p>ID: {response.user.id}</p>
    </section>
  );
}
