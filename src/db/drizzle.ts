import { env } from '@/env'
import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePostgres>

if (env.NODE_ENV === 'production') {
  const sql = neon(env.DATABASE_URL)
  db = drizzleNeon(sql)
} else {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  })

  db = drizzlePostgres({
    client: pool,
  })
}

export { db }
