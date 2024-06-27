import {api} from "encore.dev/api";
import db, {Book} from "./db";

export const list = api(
  {expose: true, method: 'GET', path: '/book'},
  async ({genre}: { genre: string }): Promise<{ books: { name: string; id: string }[] }> => {
    const books = db.filter((item) => item.genre === genre).map((item) => ({name: item.name, id: item.id}));
    return {books}
  },
);

export const get = api(
  {expose: true, method: 'GET', path: '/book/:id'},
  async ({id}: { id: string }): Promise<{ book: Book }> => {
    const book = db.find((item) => item.id === id)!;
    return {book}
  },
);

export const search = api(
  {expose: true, method: 'GET', path: '/book/search'},
  async ({name}: { name: string }): Promise<{ books: { name: string; id: string }[] }> => {
    const books = db.filter((item) => item.name.includes(name)).map((item) => ({name: item.name, id: item.id}));
    return {books}
  },
);
