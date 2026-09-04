CREATE SCHEMA "public";
CREATE TABLE "login" (
	"name" varchar(255),
	"password" varchar NOT NULL,
	CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY("name")
);
CREATE UNIQUE INDEX "SequelizeMeta_pkey" ON "login" ("name");