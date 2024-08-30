import express, { Request, Response } from "express";
import pgPromise from "pg-promise";

const router = express.Router();

// Connect to the DB with the credentials from docker-compose.yml
const db = pgPromise()({
  host: "localhost",
  port: 5432,
  database: "database",
  user: "user1",
  password: "user1@123",
});

interface User {
  name: string;
  id: number;
}

// Get one User from DB
router.get("/user/:id", async (req: Request, res: Response) => {
  const user = await db.oneOrNone<User>(
    `
        SELECT *
        FROM users
        WHERE id = $1
    `,
    req.params.id,
  );

  res.json({ user });
});

// Get all Users from DB
router.get("/user", async (req: Request, res: Response) => {
  const users = await db.map<User[]>(
    `
        SELECT *
        FROM users
    `,
    [],
    (user) => user,
  );

  res.json({ users });
});

// Add User from DB
router.post("/user", async (req: Request, res: Response) => {
  const name = req.body.name;
  const id = req.body.id;

  await db.none(
    `
        INSERT INTO users (name, id)
        VALUES ($1, $2)
    `,
    [name, id],
  );

  res.end();
});

export default router;
