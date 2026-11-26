import { useQuery } from "@tanstack/react-query"
import { useAuthenticatedClient } from "@/lib/protected-encore-client"

interface Todo {
  id: number
  title: string
  done: boolean
}

interface TodosResponse {
  todos: Todo[]
}

export function useTodos() {
  const client = useAuthenticatedClient()

  return useQuery<TodosResponse>({
    queryKey: ["todos"],
    queryFn: async () => {
      return await client.todos.todos()
    },
  })
}
