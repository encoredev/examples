import { SQLDatabase } from "encore.dev/storage/sqldb";
import { User } from "./users";

const db = new SQLDatabase("users", {
  migrations: "./migrations",
});

export async function listUsers(): Promise<User[]> {
  const rows = db.query`select id, name from users`;

  const users: User[] = [];
  for await (const row of rows) {
    users.push({ name: row.name, id: row.id });
  }

  return users;
}

export async function getUser(id: number): Promise<User | undefined> {
  const resp = await db.queryRow`select name from users where id = ${id}`;

  if (resp === null) {
    return undefined;
  }

  return { name: resp.name, id };
}

export async function createUser(name: string) {
  await db.exec`insert into users (name) values (${name})`;
}

export async function updateUser(id: number, name: string) {
  await db.exec`update users set name = ${name} where id = ${id}`;
}

export async function deleteUser(id: number) {
  await db.exec`delete from users where id = ${id}`;
}
