import { View, Text, StyleSheet } from 'react-native';
import { Link } from "expo-router";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Configurações</Text>
      <Link href="/debug/customer-debug" asChild>
        <Text className="text-blue-600 mt-6 underline">Debug</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
