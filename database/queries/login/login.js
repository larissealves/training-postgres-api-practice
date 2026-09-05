import pool from '../../config/pgConnectionLogin.js';
import argon2 from 'argon2';

function generatePassword(password){
    if(!password || !String(password)) return undefined;

    const hash = argon2.hash(password);
    return hash;
};

async function validatePasswordHash(password, dataBaseHash){
    if (!password || !dataBaseHash) return false; 

    const passwordIsValid = await argon2.verify(dataBaseHash, password);
    return passwordIsValid;
};

export async function checklogin(name, password) {
    try {
        const result = await pool.query(
        `
        SELECT name, password, "isActive" 
        FROM login 
        WHERE name=$1 
        `, [name]
        );

        const user = result.rows[0];

        if (result.rows.length === 0 || user.isActive === false) {
            return false;
        }

        const isValid =  await validatePasswordHash(password, user.password);
        const data = {logginValid: isValid, name: user.name}

        return data;
    } catch (error) {
        console.log('erro ao checar o login: ', error)
        throw error;
    }

}

