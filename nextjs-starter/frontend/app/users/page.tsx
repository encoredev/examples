import Link from "@/node_modules/next/link";
import getRequestClient from "@/app/lib/getRequestClient";

export default async function Users() {
  const client = getRequestClient();
  const response = await client.user.ListUsers();

  return (
    <section>
      <h1>Users List</h1>
      <ul>
        {response.users.map((user) => (
          <li key={user.id}>
            <Link href="/users/[id]" as={`/users/${user.id}`}>
              {user.id}:{user.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
