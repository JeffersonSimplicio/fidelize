import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { rewardsDb } from "@/database/rewardsDb";
import { Reward } from "@/interfaces/reward";
import DeleteButton from "@/components/delete-button";

export default function RewardDetailsScreen() {
  const [reward, setReward] = useState<Reward | null>(null);
  const route = useRouter();
  const { id } = useLocalSearchParams();

  const handleDelete = () => {
    rewardsDb.remove(parseInt(id as string, 10));
    Alert.alert("Recompensa deletada com sucesso!");
    route.back();
  };

  useEffect(() => {
    const fetchReward = async () => {
      const fetchedReward = await rewardsDb.getById(parseInt(id as string, 10));
      setReward(fetchedReward ?? null);
    };

    fetchReward();
  }, [id]);

  if (!reward) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Detalhes",
          }}
        />
        <View style={styles.container}>
          <Text>Reward not found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: reward.name,
        }}
      />
      <View style={styles.container}>
        <Text>Reward</Text>
        <Text>Name: {reward.name}</Text>
        <Text>Description: {reward.description}</Text>
        <Text>Points Required: {reward.pointsRequired}</Text>
      </View>
      <DeleteButton onDelete={handleDelete} />
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
