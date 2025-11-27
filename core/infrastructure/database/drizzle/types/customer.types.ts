import { customers } from '@/core/infrastructure/database/drizzle/schema';

export type CustomerTable = typeof customers;

export type CustomerSelect = typeof customers.$inferSelect;
