import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './database/schema/index.ts',
	out: './drizzle',
  dialect: 'sqlite',
	driver: 'expo',
});
