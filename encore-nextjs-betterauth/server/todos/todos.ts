import { api } from "encore.dev/api"
import { db, DB } from "../auth/db"

interface Todo {
  id: number
  title: string
  done: boolean
}

interface Response {
  todos: Todo[]
}

export const todos = api(
  { method: "GET", path: "/todos", expose: true, auth: true },
  async (): Promise<Response> => {
    const todos = await db.query.todos.findMany()
    return { todos }
  },
)
