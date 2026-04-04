import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  timeline: text("timeline"),
  quizAnswers: jsonb("quiz_answers"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const quizAnswerSchema = z.object({
  firstTimeBuyer: z.string(),
  creditScore: z.string(),
  income: z.string(),
  priceRange: z.string(),
  downPaymentNeed: z.string(),
});

export type QuizAnswers = z.infer<typeof quizAnswerSchema>;
