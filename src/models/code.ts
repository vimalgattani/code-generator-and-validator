import db from '../config/database'
import _ from 'lodash'
import { GeneratedCode } from '../interfaces';

export const generateCode = async (email: string, code: string): Promise<GeneratedCode | undefined> => {
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

export const getGeneratedCode = async (email: string): Promise<GeneratedCode | undefined> => {
    const generatedCode = await db.query(`
        SELECT code, email, valid_till, is_validated
        FROM codes 
        WHERE email = $1
    `, [email]);
    return _.first(generatedCode);
}

export const validateCode = async (email: String) => {
    await db.query(`
        UPDATE codes 
        SET is_validated = true
        WHERE email = $1
    `, [email]);
}