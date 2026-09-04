import pg from 'pg'
const { Pool, Client } = pg
const connectionString = process.env.DATABASE_URL_LOGIN;
 
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  sslnegotiation: 'direct',
})
 
//await pool.query('SELECT NOW()')
//await pool.end()


export default pool;