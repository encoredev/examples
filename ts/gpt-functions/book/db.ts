export interface Book {
  id: string;
  name: string;
  genre: Genre;
  description: string;
}

export enum Genre {
  mystery = "mystery",
  nonfiction = "nonfiction",
  memoir = "memoir",
  romance = "romance",
  historical = "historical",
}

// Using a hardcoded database here for convenience of this example
// Here is how to create a database in a real application: https://encore.dev/docs/ts/primitives/databases
const db: Book[] = [
  {
    id: "a1",
    name: "To Kill a Mockingbird",
    genre: Genre.historical,
    description: `Compassionate, dramatic, and deeply moving, "To Kill A Mockingbird" takes readers to the roots of human behavior - to innocence and experience, kindness and cruelty, love and hatred, humor and pathos. Now with over 18 million copies in print and translated into forty languages, this regional story by a young Alabama woman claims universal appeal. Harper Lee always considered her book to be a simple love story. Today it is regarded as a masterpiece of American literature.`,
  },
  {
    id: "a2",
    name: "All the Light We Cannot See",
    genre: Genre.historical,
    description: `In a mining town in Germany, Werner Pfennig, an orphan, grows up with his younger sister, enchanted by a crude radio they find that brings them news and stories from places they have never seen or imagined. Werner becomes an expert at building and fixing these crucial new instruments and is enlisted to use his talent to track down the resistance. Deftly interweaving the lives of Marie-Laure and Werner, Doerr illuminates the ways, against all odds, people try to be good to one another.`,
  },
  {
    id: "a3",
    name: "Where the Crawdads Sing",
    genre: Genre.historical,
    description: `For years, rumors of the “Marsh Girl” haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild; unfit for polite society. So in late 1969, when the popular Chase Andrews is found dead, locals immediately suspect her.
But Kya is not what they say. A born naturalist with just one day of school, she takes life's lessons from the land, learning the real ways of the world from the dishonest signals of fireflies. But while she has the skills to live in solitude forever, the time comes when she yearns to be touched and loved. Drawn to two young men from town, who are each intrigued by her wild beauty, Kya opens herself to a new and startling world—until the unthinkable happens.`,
  },
  {
    id: "a4",
    name: "Sapiens: A Brief History of Humankind",
    genre: Genre.nonfiction,
    description:
      "A nonfiction book by Yuval Noah Harari, published in 2011. It explores the history of humankind from the emergence of Homo sapiens in the Stone Age up to the present.",
  },
  {
    id: "a5",
    name: "The Girl with the Dragon Tattoo",
    genre: Genre.mystery,
    description:
      "A mystery novel by Stieg Larsson, published in 2005. It follows journalist Mikael Blomkvist and hacker Lisbeth Salander as they investigate the disappearance of a wealthy industrialist's niece from 40 years ago.",
  },
  {
    id: "a6",
    name: "Becoming",
    genre: Genre.memoir,
    description:
      "A memoir by Michelle Obama, published in 2018. It chronicles her life from her childhood on the South Side of Chicago to her years as an executive and her time as First Lady of the United States.",
  },
  {
    id: "a7",
    name: "Pride and Prejudice",
    genre: Genre.romance,
    description:
      "A romance novel by Jane Austen, published in 1813. It charts the emotional development of the protagonist, Elizabeth Bennet, who learns about the repercussions of hasty judgments and the value of family and love.",
  },
];

export default db;
