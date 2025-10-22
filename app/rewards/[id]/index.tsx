import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRewardDetails } from "@/ui/hooks/reward-details/use-reward-details";
import {
  CustomersWhoRedeemedList,
  EligibleCustomersList,
  CustomerInfo,
} from "@/ui/components/reward-details";
import { EntityActions } from "@/ui/components/entity-actions";

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
    redeem,
    undoRedeem,
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
      <View>
        <CustomerInfo reward={reward} />

        <EligibleCustomersList
          customers={eligibleCustomers}
          onRedeem={redeem}
        />

        <CustomersWhoRedeemedList
          customers={customersWhoRedeemed}
          onUndoRedeem={undoRedeem}
          isActive={reward.isActive}
        />

        <EntityActions
          onDelete={handleDelete}
          onEdit={() => router.push(`/rewards/${rewardId}/edit`)}
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
