CREATE SCHEMA "public";
CREATE TABLE "login" (
	"name" varchar(255),
	"password" varchar NOT NULL,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY("name")
);
CREATE UNIQUE INDEX "SequelizeMeta_pkey" ON "login" ("name");