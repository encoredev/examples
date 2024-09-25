import { api, APIError } from "encore.dev/api";
import { Book } from "../graphql/__generated__/resolvers-types";

const db: Book[] = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  {
    title: "1984",
    author: "George Orwell",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
  },
];

export const list = api(
  { expose: true, method: "GET", path: "/books" },
  async (): Promise<{ books: Book[] }> => {
    return { books: db };
  },
);

// Omit the "__typename" field from the Book type
type AddRequest = Omit<Required<Book>, "__typename">;

export const add = api(
  { expose: true, method: "POST", path: "/book" },
  async (book: AddRequest): Promise<{ book: Book }> => {
    if (db.some((b) => b.title === book.title)) {
      throw APIError.alreadyExists(
        `Book "${book.title}" is already in database`,
      );
    }
    db.push(book);
    return { book };
  },
);
