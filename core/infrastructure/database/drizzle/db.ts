import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from '@/core/infrastructure/database/drizzle/schema';

const expoDb = openDatabaseSync('db.db', { enableChangeListener: true });

expoDb.execSync('PRAGMA foreign_keys = ON');

export const db = drizzle(expoDb, { schema });

export type drizzleClient = typeof db;
