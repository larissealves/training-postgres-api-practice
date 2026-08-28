import pool from "../../config/pgConnection.js";

export async function getIngredients() {
    try {
        const listIngredients = await pool.query(
            `SELECT * FROM "Ingredient"`,
        );
        console.log(listIngredients);
        return listIngredients.rows;

    } catch (error) {
        console.log("DB - getIngredients() ", error);
        throw error;
    }

}

getIngredients();