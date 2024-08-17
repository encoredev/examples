CREATE TABLE "users" (
  "id" SERIAL NOT NULL,
  "name" character varying NOT NULL,
  "surname" character varying NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);