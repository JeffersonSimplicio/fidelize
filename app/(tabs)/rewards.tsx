import { FlatList, RefreshControl, Text, View } from "react-native";
import { useCallback } from "react";
import { Link, useFocusEffect } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRewards } from "@/ui/hooks/rewards/use-rewards";

export default function RewardsScreen() {
  const { rewards, refreshing, onRefresh, fetchRewards } = useRewards();

  useFocusEffect(
    useCallback(() => {
      fetchRewards();
    }, [fetchRewards])
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Lista de Recompensas
      </Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <Link href={`/rewards/${item.id}`}>
            <Text>
              {item.name} - {item.pointsRequired} pontos necessários
            </Text>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Nenhuma recompensa cadastrada.</Text>
          </View>
        )}
      />
      <Link href="/rewards/create">
        <FontAwesome6 name="add" size={24} color="black" />
      </Link>
    </View>
  );
}
