import { FlatList, RefreshControl, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { listRewards } from "@/core/composition/rewards/list-rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";

export default function RewardsScreen() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRewards = useCallback(async () => {
    const rewards = await listRewards.execute();
    setRewards(rewards);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRewards();
    }, [fetchRewards])
  );

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
          <Link href={`/rewards/${item.id}`}>
            <Text>
              {item.name} - {item.pointsRequired} pontos necessários
            </Text>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Link href="/rewards/create">
        <FontAwesome6 name="add" size={24} color="black" />
      </Link>
    </View>
  );
}
