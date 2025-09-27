import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Referral system tables
export const referralEvents = pgTable("referral_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerUserId: varchar("referrer_user_id").notNull(),
  referredUserId: varchar("referred_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const referralClaims = pgTable("referral_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: integer("amount").notNull(), // Amount in tTRUST * 100 (for decimal precision)
  referralCount: integer("referral_count").notNull(), // Number of referrals at time of claim
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReferralEventSchema = createInsertSchema(referralEvents).pick({
  referrerUserId: true,
  referredUserId: true,
});

export const insertReferralClaimSchema = createInsertSchema(referralClaims).pick({
  userId: true,
  amount: true,
  referralCount: true,
});

export type InsertReferralEvent = z.infer<typeof insertReferralEventSchema>;
export type ReferralEvent = typeof referralEvents.$inferSelect;
export type InsertReferralClaim = z.infer<typeof insertReferralClaimSchema>;
export type ReferralClaim = typeof referralClaims.$inferSelect;

// Response types for API
export const referralStatsSchema = z.object({
  totalReferrals: z.number(),
  totalEarned: z.number(),
  claimableRewards: z.number(),
  referralLink: z.string(),
});

export type ReferralStats = z.infer<typeof referralStatsSchema>;

// User profile and XP system
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  displayName: text("display_name"),
  xp: integer("xp").default(0).notNull(),
  level: integer("level").default(0).notNull(),
  questsCompleted: integer("quests_completed").default(0).notNull(),
  socialProfiles: text("social_profiles").default('{}').notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// XP and tier system constants
export const XP_PER_LEVEL = 20;

// Tier system - tiers are independent of levels
export const TIERS = ["enchanter", "illuminated", "conscious", "oracle", "templar"] as const;
export type Tier = typeof TIERS[number];

export const TIER_ORDER: Record<Tier, number> = {
  enchanter: 1,
  illuminated: 2,
  conscious: 3,
  oracle: 4,
  templar: 5
} as const;

export const TIER_DISPLAY: Record<Tier, string> = {
  enchanter: "Enchanter",
  illuminated: "Illuminated", 
  conscious: "Conscious",
  oracle: "Oracle",
  templar: "Templar"
} as const;

export const TIER_COLORS: Record<Tier, string> = {
  enchanter: "#8b5cf6", // purple
  illuminated: "#10b981", // green
  conscious: "#3b82f6", // blue
  oracle: "#6366f1", // indigo
  templar: "#ef4444" // red
} as const;

// Level thresholds to unlock tiers (levels needed to achieve each tier)
export const TIER_UNLOCK_MIN_LEVEL: Record<Tier, number> = {
  enchanter: 0,   // Starting tier
  illuminated: 5, // Level 5 required to unlock Illuminated
  conscious: 15,  // Level 15 required to unlock Conscious
  oracle: 30,     // Level 30 required to unlock Oracle
  templar: 50     // Level 50 required to unlock Templar
} as const;

export type TierType = Tier;

// Helper function schemas
export const getTierFromLevelSchema = z.function()
  .args(z.number())
  .returns(z.enum(["enchanter", "illuminated", "conscious", "oracle", "templar"]));

export const getXpForNextLevelSchema = z.function()
  .args(z.number(), z.number())
  .returns(z.number());
