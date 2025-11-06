import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

await sql`
  DROP SCHEMA public CASCADE;
`;

await sql`
  CREATE SCHEMA public;
`;

await sql.end();

process.exit(0);