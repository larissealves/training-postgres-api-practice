import pool from '../../config/pgConnection.js';

export async function getDish(currentPage = 1, limit = 5) {

    const offset = (currentPage - 1) * limit;

    try {
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
            
            LIMIT $1
            OFFSET $2
            `, [limit, offset]
        );
        console.log(result.rows);

        return result.rows;

    } catch (error) {
        console.error('DB - getDish():', error);
        throw error;
    }
}

export async function createDish(dishDetails = {}) {

    const formDish = {
        dish_name: dishDetails.name,
        dish_price: dishDetails.price,
        dish_description: dishDetails.description,
        dish_createdAt: dishDetails.createdAt,
        dish_isActive: dishDetails.isActive,
        categoryId: dishDetails.categoryId
    };

    const tagsId = dishDetails.tagsId ?? [];
    const ingredientsId = dishDetails.ingredientsId ?? [];

    const client = await pool.connect();

    try {

        await client.query('BEGIN');

        // Cria o prato
        const result = await client.query(
            `
            INSERT INTO "Dish" (
                name,
                price,
                description,
                "createdAt",
                "isActive",
                "categoryId"
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `,
            [
                formDish.dish_name,
                formDish.dish_price,
                formDish.dish_description,
                formDish.dish_createdAt,
                formDish.dish_isActive,
                formDish.categoryId
            ]
        );

        const dishId = result.rows[0].id;


        // Relaciona as tags
        for (const tagId of tagsId) {

            await client.query(
                `
                INSERT INTO "DishTag" (
                    "dishId",
                    "tagId"
                )
                VALUES ($1, $2)
                `,
                [dishId, tagId]
            );

        }


        // Relaciona os ingredientes
        for (const ingredientId of ingredientsId) {

            await client.query(
                `
                INSERT INTO "DishIngredients" (
                    "dishId",
                    "ingredientsId"
                )
                VALUES ($1, $2)
                `,
                [dishId, ingredientId]
            );

        }


        await client.query('COMMIT');

        return dishId;

    } catch (error) {

        await client.query('ROLLBACK');

        console.error('DB - createDish():', error);

        throw error;

    } finally {

        client.release();

    }
}


getDish();
