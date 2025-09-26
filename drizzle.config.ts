import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './infrastructure/database/drizzle/schema/index.ts',
	out: './drizzle',
  dialect: 'sqlite',
	driver: 'expo',
});
