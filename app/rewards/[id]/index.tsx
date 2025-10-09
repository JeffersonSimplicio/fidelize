import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DeleteButton } from "@/ui/components/delete-button";
import { FontAwesome } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";
import { useRewardDetails } from "@/ui/hooks/reward-details/use-reward-details";
import { EligibleCustomersList } from "@/ui/components/reward-details/eligible-customers-list";
import { CustomersWhoRedeemedList } from "@/ui/components/reward-details/customers-who-redeemed-list";

export default function RewardDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const rewardId = parseInt(id as string, 10);

  const {
    reward,
    eligibleCustomers,
    customersWhoRedeemed,
    reloadAll,
    handleDelete,
  } = useRewardDetails(rewardId, () => router.back());

  useFocusEffect(
    useCallback(() => {
      reloadAll();
    }, [reloadAll])
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
          <Text>A recompensa não foi encontrada!</Text>
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
        <Text>Recompensa</Text>
        <Text>Nome: {reward.name}</Text>
        <Text>Descrição: {reward.description}</Text>
        <Text>Pontos Necessários: {reward.pointsRequired}</Text>
      </View>

      <EligibleCustomersList
        customers={eligibleCustomers}
        onRedeem={(rewardId) => console.log("WIP", rewardId)}
      />

      <CustomersWhoRedeemedList customers={customersWhoRedeemed} />

      <DeleteButton onDelete={handleDelete} />
      <AppButton onPress={() => router.push(`/rewards/${reward.id}/edit`)}>
        <FontAwesome name="edit" size={30} color="black" />
      </AppButton>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
