import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

const users = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export default function Details() {
  const { id } = useLocalSearchParams();
  const user = users.find((user) => user.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: user ? user.name : "Detalhes",
        }}
      />
      <View style={styles.container}>
        {user ? (
          <Text>Details of user {user?.name}</Text>
        ) : (
          <Text>User not found</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
