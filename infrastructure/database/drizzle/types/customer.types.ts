import { customers } from '../schema';

export type CustomerTable = typeof customers;

export type CustomerSelect = typeof customers.$inferSelect;