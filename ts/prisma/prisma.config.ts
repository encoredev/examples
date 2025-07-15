import "dotenv/config";
import type { PrismaConfig } from "prisma";
import { PrismaPg } from "@prisma/adapter-pg";

type Env = {
  DB_URL: string;
};

export default {
  earlyAccess: true,
  schema: "./users/prisma/schema.prisma",
  studio: {
    adapter: async (env: Env) => {
      // connect the studio to the main encore database
      return new PrismaPg({ connectionString: env.DB_URL });
    },
  },
} satisfies PrismaConfig<Env>;
