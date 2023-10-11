import getRequestClient from "../lib/getRequestClient.ts";
import { user } from "../lib/client.ts";
import { Link, useLoaderData } from "react-router-dom";

export function userListLoader() {
  const client = getRequestClient();
  return client.user.ListUsers();
}

function UserListPage() {
  const data = useLoaderData() as user.ListResponse;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>
              {user.name} ({user.id})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserListPage;
