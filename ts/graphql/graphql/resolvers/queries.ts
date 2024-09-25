import { book } from "~encore/clients";
import { QueryResolvers } from "../__generated__/resolvers-types";

// Use the generated `QueryResolvers` type to type check our queries!
const queries: QueryResolvers = {
  books: async () => {
    const { books } = await book.list();
    return books;
  },
};

export default queries;
