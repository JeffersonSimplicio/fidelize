import { db } from "@/core/infrastructure/database/drizzle/db";
import migrations from "@/core/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { Text, View, ActivityIndicator } from "react-native";
import "../ui/styles/global.css";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4">
        <Text className="text-error text-lg font-semibold">
          Migration error: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-text-secondary mt-4 text-base">
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
