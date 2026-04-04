import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { leads } from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Initialize tables if they don't exist
export async function initializeDatabase() {
  try {
    // Test connection
    await sql`SELECT 1`;
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}