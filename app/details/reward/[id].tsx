import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { rewardsDb } from "../../../database/rewardsDb";
import { Reward } from "../../../interfaces/reward";

export default function RewardDetails() {
  const [reward, setReward] = useState<Reward | null>(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchReward = async () => {
      const fetchedReward = await rewardsDb.getById(
        parseInt(id as string, 10)
      );
      setReward(fetchedReward ?? null);
    };

    fetchReward();
  }, [id]);

  if (!reward) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Detalhes',
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
