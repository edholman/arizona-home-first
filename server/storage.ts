import { type Lead, type InsertLead, leads } from "@shared/schema";
import { db } from "./db";
import { randomUUID } from "crypto";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
}

export class MemStorage implements IStorage {
  private leads: Map<string, Lead>;

  constructor() {
    this.leads = new Map();
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { 
      ...insertLead, 
      id,
      createdAt: new Date(),
      timeline: insertLead.timeline || null,
      quizAnswers: insertLead.quizAnswers || null,
    };
    this.leads.set(id, lead);
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(insertLead).returning();
    return result[0];
  }

  async getAllLeads(): Promise<Lead[]> {
    const result = await db.select().from(leads).orderBy(leads.createdAt);
    return result;
  }
}

// Database endpoint still disabled - using memory storage temporarily
export const storage = new MemStorage();
// export const storage = new DatabaseStorage();
