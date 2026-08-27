import pool from '../../config/pgConnection.js';

export async function getDish() {
    const result = await pool.query(
        `SELECT 
            "Dish".name AS "dishName", price, description, "Dish"."createdAt" AS dishCreatedAt, "Dish"."isActive" AS dishIsActive, 
            "Category".name AS "categoryName", 
            
            ARRAY_AGG("Tag".name) AS tagsName,
            ARRAY_AGG("Ingredient".name) AS ingredientsName,
            ARRAY_AGG("DishImageBinary"."binaryData") AS listImages

            FROM "Dish" 

            INNER JOIN "Category" 
                ON "Dish"."categoryId" = "Category".id 
            
            INNER JOIN "DishTag" 
                ON "DishTag"."dishId" = "Dish".id

            INNER JOIN "Tag" 
                ON "Tag".id = "DishTag"."tagId"

            INNER JOIN "DishIngredient"
                ON "Dish"."id" = "DishIngredient"."dishId"

            INNER JOIN "Ingredient" 
                ON "Ingredient".id = "DishIngredient"."ingredientId"

            INNER JOIN "DishImage"
                ON "Dish"."id" =  "DishImage"."dishId"
            
            INNER JOIN "DishImageBinary"
                ON "DishImage"."dishId" = "DishImageBinary"."dishImageId"

            GROUP BY
                "Dish".name,
                "Dish".price,
                "Dish".description,
                "Dish"."createdAt",
                "Dish"."isActive",
                "Category".name
            `
    );
    console.log(result.rows);

    return result.rows;
}


getDish();
