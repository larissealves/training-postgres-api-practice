import pool from '../config/pgConnection.js';

export async function getDish(currentPage = 1, limit = 3, filters = {}) {

    const offset = (currentPage - 1) * limit;

    //FORMAT FOR: filterTags and filterIngredients = {1, 2,3}
    const filterTags = filters.tags?.length ? `{${filters.tags}}` : null;
    const filterIngredients = filters.ingredients?.length ? `{${filters.ingredients}}` : null;
    const filterCategory = filters.category || null;
    const filterName = filters.name?.trim() || null;


    try {
        const paginationTotalItems = await pool.query(
        `
            SELECT COUNT(DISTINCT "Dish".id) AS "totalItems"

            FROM "Dish"

            LEFT JOIN "DishTag"
                ON "DishTag"."dishId" = "Dish".id

            LEFT JOIN "Tag"
                ON "Tag".id = "DishTag"."tagId"

            LEFT JOIN "DishIngredient"
                ON "Dish"."id" = "DishIngredient"."dishId"

            WHERE
            ($1:: integer[] IS NULL
                    OR "Tag".id = ANY($1:: integer[])
            ) AND
                    
            ($2:: integer[] IS NULL
                    OR "DishIngredient"."dishId" = ANY($2:: integer[])
            ) AND
                    
            ($3:: integer IS NULL
                    OR "Dish"."categoryId" = $3:: integer
            ) AND
                    
            ($4:: text IS NULL
                    OR "Dish"."name" ILIKE '%' || $4:: text || '%'
            )

            `, [filterTags, filterIngredients, filterCategory, filterName]
        );

        const result = await pool.query(
            `SELECT 
                "Dish".name AS "dishName", 
                price, description, "Dish"."createdAt" AS dishCreatedAt, 
                "Dish"."isActive" AS dishIsActive, 
                "Category".name AS "categoryName",
                "Dish"."id",
            
            ARRAY_AGG(DISTINCT "Tag".name) AS tagsName,
            ARRAY_AGG(DISTINCT "Ingredient".name) AS ingredientsName,
            
            COALESCE(
                ARRAY_AGG(
                    DISTINCT "DishImageBinary"."binaryData"
                ) FILTER (
                    WHERE "DishImageBinary"."binaryData" IS NOT NULL
                ),
                '{}'
            ) AS "listImages"

            FROM "Dish" 

            LEFT JOIN "Category" 
                ON "Dish"."categoryId" = "Category".id 
            
            LEFT JOIN "DishTag" 
                ON "DishTag"."dishId" = "Dish".id

            LEFT JOIN "Tag" 
                ON "DishTag"."tagId" = "Tag".id 

            LEFT JOIN "DishIngredient"
                ON "DishIngredient"."dishId" = "Dish"."id" 

            LEFT JOIN "Ingredient" 
                ON "Ingredient"."id" = "DishIngredient"."ingredientId"

            LEFT JOIN "DishImage"
                ON "Dish"."id" =  "DishImage"."dishId"
            
            LEFT JOIN "DishImageBinary"
                ON "DishImage"."dishId" = "DishImageBinary"."dishImageId"

            WHERE             
            ( $1::integer[] IS NULL
                    OR "Tag".id = ANY($1::integer[])                    
            ) AND
            
            ( $2::integer[] IS NULL 
                OR "Ingredient"."id" = ANY($2::integer[])
            ) AND

            ( $3::integer IS NULL 
                OR "Dish"."categoryId" = $3::integer
            ) AND

            ( $4::text IS NULL 
                OR "Dish"."name" ILIKE '%' ||  $4::text || '%'
            )

            GROUP BY
                "Dish".name,
                "Dish".price,
                "Dish".description,
                "Dish"."createdAt",
                "Dish"."isActive",
                "Category".name,
                "Dish"."id"

            ORDER BY "Dish"."name" ASC

            LIMIT $5
            OFFSET $6
            `, [filterTags, filterIngredients, filterCategory, filterName, limit, offset]
        );

        const totalItems = Number(paginationTotalItems.rows[0].totalItems);
        return { data: result.rows, totalItems: totalItems };

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
        dish_createdAt: new Date(),
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
                    "tagId",
                    "updatedAt"
                )
                VALUES ($1, $2, NOW())
                `,
                [dishId, tagId]
            );

        }


        // Relaciona os ingredientes
        for (const ingredientId of ingredientsId) {

            await client.query(
                `
                INSERT INTO "DishIngredient" (
                    "dishId",
                    "ingredientId",
                    "updatedAt"
                )
                VALUES ($1, $2, NOW())
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

