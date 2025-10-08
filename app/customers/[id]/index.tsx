import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CustomerInfo } from "@/ui/components/customer-info";
import { RedeemedRewardsList } from "@/ui/components/redeemed-rewards-list";
import { AvailableRewardsList } from "@/ui/components/available-rewards-list";
import { CustomerActions } from "@/ui/components/customer-actions";
import { useCustomerDetails } from "@/ui/hooks/customer-details/use-customer-details";

export default function CustomerDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const customerId = parseInt(id as string, 10);
  const {
    customer,
    availableRewards,
    redeemedRewards,
    reloadAll,
    handleDelete,
    redeem,
    undoRedeem,
  } = useCustomerDetails(customerId, () => router.back());

  useFocusEffect(
    useCallback(() => {
      reloadAll();
    }, [reloadAll])
  );

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
          onEdit={() => router.push(`/customers/${customerId}/edit`)}
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
