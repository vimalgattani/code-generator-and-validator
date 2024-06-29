import db from '../config/database.js'
import { getRandomGeneratedCode } from '../utils/index.js'
import _ from 'lodash'

export const generateCode = async (email, code) => {
    console.log({email, code})
    const generatedCode = await db.query(`
            INSERT INTO codes(email, code)
            VALUES ($1, $2)
            ON CONFLICT(email)
            DO UPDATE
            SET 
                code = EXCLUDED.code,
                created_at = now(),
                valid_till = EXTRACT(epoch from now()) + 300,
                is_validated = false
            RETURNING *
    `, [email, code]);
    return _.first(generatedCode);
}

export const getGeneratedCode = async (email) => {
    const generatedCode = await db.query(`
        SELECT code, email, valid_till, is_validated
        FROM codes 
        WHERE email = $1
    `, [email]);
    return _.first(generatedCode);
}

export const validateCode = async (email) => {
    await db.query(`
        UPDATE codes 
        SET is_validated = true
        WHERE email = $1
    `, [email]);
}