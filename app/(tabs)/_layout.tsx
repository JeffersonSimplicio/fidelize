import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: Platform.OS === "android" ? 60 : 80,
          paddingBottom: Platform.OS === "android" ? 8 : 16,
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTitleStyle: {
          color: "#111827",
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="users" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Prêmios",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="trophy" color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="cog" color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
