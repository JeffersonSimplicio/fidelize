import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { getCustomerDetail } from "@/core/composition/customers/get-customer-detail";
import { deleteCustomer } from "@/core/composition/customers/delete-customer";
import { listAvailableRewardsForCustomer } from "@/core/composition/customer-rewards/list-available-rewards-customer";
import { listRedeemedRewardsForCustomer } from "@/core/composition/customer-rewards/list-redeemed-rewards-customer";
import { redeemReward } from "@/core/composition/customer-rewards/redeem-reward";
import { Customer } from "@/core/domain/customers/customer.entity";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { undoRedeemReward } from "@/core/composition/customer-rewards/undo-redeem-reward";
import { CustomerInfo } from "@/ui/components/customer-info";
import { RedeemedRewardsList } from "@/ui/components/redeemed-rewards-list";
import { AvailableRewardsList } from "@/ui/components/available-rewards-list";
import { CustomerActions } from "@/ui/components/customer-actions";

export default function CustomerDetailsScreen() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [availableRewards, setAvailableRewards] = useState<Reward[] | null>(
    null
  );
  const [redeemedRewards, setRedeemedRewards] = useState<Reward[] | null>(null);
  const route = useRouter();
  const { id } = useLocalSearchParams();

  const handleDelete = async () => {
    await deleteCustomer.execute(parseInt(id as string, 10));
    Alert.alert("Cliente deletado com sucesso!");
    route.back();
  };

  const fetchRedeemedRewards = useCallback(async () => {
    const fetchedRedeemedRewards = await listRedeemedRewardsForCustomer.execute(
      parseInt(id as string, 10)
    );
    setRedeemedRewards(fetchedRedeemedRewards ?? null);
  }, [id]);

  const fetchAvailableRewards = useCallback(async () => {
    const fetchedAvailableRewards =
      await listAvailableRewardsForCustomer.execute(parseInt(id as string, 10));
    setAvailableRewards(fetchedAvailableRewards ?? null);
  }, [id]);

  const fetchCustomers = useCallback(async () => {
    const fetchedCustomer = await getCustomerDetail.execute(
      parseInt(id as string, 10)
    );
    setCustomer(fetchedCustomer ?? null);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
      fetchAvailableRewards();
      fetchRedeemedRewards();
    }, [fetchCustomers, fetchAvailableRewards, fetchRedeemedRewards])
  );

  const redeem = async (rewardId: number) => {
    await redeemReward.execute(parseInt(id as string, 10), rewardId);
    fetchRedeemedRewards();
    fetchAvailableRewards();
  };

  const undoRedeem = async (rewardId: number) => {
    await undoRedeemReward.execute(parseInt(id as string, 10), rewardId);
    fetchRedeemedRewards();
    fetchAvailableRewards();
  };

  if (!customer) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Detalhes",
          }}
        />
        <View style={styles.container}>
          <Text>Usuário não foi encontrado!</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: customer.name,
        }}
      />
      <View style={styles.container}>
        <CustomerInfo customer={customer} />

        <RedeemedRewardsList
          rewards={redeemedRewards}
          onUndoRedeem={undoRedeem}
        />

        <AvailableRewardsList rewards={availableRewards} onRedeem={redeem} />

        <CustomerActions
          onDelete={handleDelete}
          onEdit={() => route.push(`/customers/${customer.id}/edit`)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
