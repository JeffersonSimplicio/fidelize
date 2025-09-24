import { FlatList, RefreshControl, Text, View } from "react-native";
import { Reward } from "../../interfaces/reward";
import { rewardsDb } from "../../database/rewardsDb";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function RewardsScreen() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRewards = async () => {
    const rewards = await rewardsDb.getAll();
    setRewards(rewards);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRewards();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Lista de Recompensas
      </Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/details/reward/${item.id}`}>
            <Text>
              {item.name} - {item.pointsRequired} pontos necessários
            </Text>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Link href="/create/reward">
        <FontAwesome6 name="add" size={24} color="black" />
      </Link>
    </View>
  );
}
