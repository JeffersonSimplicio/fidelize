import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { Text, View, ActivityIndicator } from 'react-native';
import '../ui/styles/global.css';
import { StatusBar } from 'expo-status-bar';

import { db } from '@/core/infrastructure/database/drizzle/db';
import migrations from '@/core/drizzle/migrations';

export default function Layout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="text-lg font-semibold text-error">
          Migration error: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-base text-text-secondary">
          Migration is in progress...
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="inverted" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
