import pkg from 'pg';
const { Pool } = pkg; 
import 'dotenv/config.js'

class Database {
  private pool: any;
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });
  }

  async query(text: string, params?: any[]): Promise<any []> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Database query failed with error: ${error}`);
    } finally {
      client.release();
    }
  }
}

export default new Database();