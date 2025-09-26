import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './core/infrastructure/database/drizzle/schema/index.ts',
	out: './core/drizzle',
  dialect: 'sqlite',
	driver: 'expo',
});
