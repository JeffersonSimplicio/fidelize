import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { rewardsDb } from "@/database_old/rewardsDb";
import { Reward } from "@/interfaces/reward";
import DeleteButton from "@/ui/components/delete-button";
import { FontAwesome } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";

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
      <AppButton onPress={() => route.push(`/rewards/${reward.id}/edit`)}>
        <FontAwesome name="edit" size={30} color="black" />
      </AppButton>
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
