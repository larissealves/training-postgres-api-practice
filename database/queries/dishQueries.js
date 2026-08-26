import pool from '../../config/pgConnection.js';

export async function getDish() {
    const result = await pool.query(
        'SELECT * FROM "Tag"'
    );
    console.log(result.rows);

    return result.rows;
}

getDish();
