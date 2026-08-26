CREATE SCHEMA "public";
CREATE TABLE "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
CREATE TABLE "Category" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE "Dish" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"price" double precision NOT NULL,
	"description" text NOT NULL,
	"categoryId" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE "DishImage" (
	"id" serial PRIMARY KEY,
	"dishId" integer NOT NULL,
	"imageName" text NOT NULL,
	"imageType" text NOT NULL,
	"isPrimary" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp NOT NULL
);
CREATE TABLE "DishImageBinary" (
	"id" serial PRIMARY KEY,
	"dishImageId" integer NOT NULL,
	"binaryData" bytea NOT NULL
);
CREATE TABLE "DishIngredient" (
	"id" serial PRIMARY KEY,
	"dishId" integer NOT NULL,
	"ingredientId" integer NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp NOT NULL
);
CREATE TABLE "DishTag" (
	"id" serial PRIMARY KEY,
	"dishId" integer NOT NULL,
	"tagId" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp NOT NULL
);
CREATE TABLE "Ingredient" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE "Tag" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX "_prisma_migrations_pkey" ON "_prisma_migrations" ("id");
CREATE UNIQUE INDEX "Category_pkey" ON "Category" ("id");
CREATE UNIQUE INDEX "Dish_pkey" ON "Dish" ("id");
CREATE UNIQUE INDEX "DishImage_pkey" ON "DishImage" ("id");
CREATE UNIQUE INDEX "DishImageBinary_dishImageId_key" ON "DishImageBinary" ("dishImageId");
CREATE UNIQUE INDEX "DishImageBinary_pkey" ON "DishImageBinary" ("id");
CREATE UNIQUE INDEX "DishIngredient_pkey" ON "DishIngredient" ("id");
CREATE UNIQUE INDEX "DishTag_pkey" ON "DishTag" ("id");
CREATE UNIQUE INDEX "Ingredient_pkey" ON "Ingredient" ("id");
CREATE UNIQUE INDEX "Tag_pkey" ON "Tag" ("id");
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DishImage" ADD CONSTRAINT "DishImage_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DishImageBinary" ADD CONSTRAINT "DishImageBinary_dishImageId_fkey" FOREIGN KEY ("dishImageId") REFERENCES "DishImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DishIngredient" ADD CONSTRAINT "DishIngredient_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DishIngredient" ADD CONSTRAINT "DishIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DishTag" ADD CONSTRAINT "DishTag_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DishTag" ADD CONSTRAINT "DishTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;