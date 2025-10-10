import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useCustomerDetails } from "@/ui/hooks/customer-details/use-customer-details";
import {
  AvailableRewardsList,
  CustomerInfo,
  RedeemedRewardsList,
} from "@/ui/components/customer-details";
import { EntityActions } from "@/ui/components/entity-actions";

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

        <AvailableRewardsList rewards={availableRewards} onRedeem={redeem} />

        <RedeemedRewardsList
          rewards={redeemedRewards}
          onUndoRedeem={undoRedeem}
        />

        <EntityActions
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
