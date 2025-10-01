import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import DeleteButton from "@/ui/components/delete-button";
import { FontAwesome } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";
import { getRewardDetail } from "@/core/composition/rewards/get-reward-detail";
import { deleteReward } from "@/core/composition/rewards/delete-reward";
import { Reward } from "@/core/domain/rewards/reward.entity";

export default function RewardDetailsScreen() {
  const [reward, setReward] = useState<Reward | null>(null);
  const route = useRouter();
  const { id } = useLocalSearchParams();

  const handleDelete = () => {
    deleteReward.execute(parseInt(id as string, 10));
    Alert.alert("Recompensa deletada com sucesso!");
    route.back();
  };

  const fetchReward = useCallback(async () => {
    const fetchedReward = await getRewardDetail.execute(
      parseInt(id as string, 10)
    );
    setReward(fetchedReward ?? null);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchReward();
    }, [fetchReward])
  );

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
