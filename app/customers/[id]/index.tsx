import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback } from "react";
import { FlatList, View, Text } from "react-native";
import { useCustomerDetails } from "@/ui/hooks/customer-details/use-customer-details";
import {
  AvailableRewardsList,
  CustomerInfo,
  RedeemedRewardsList,
} from "@/ui/features/customer";
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
        <Stack.Screen options={{ title: "Detalhes" }} />
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-gray-600 text-base">
            Usuário não foi encontrado!
          </Text>
        </View>
      </>
    );
  }

  const sections = [
    { key: "info", render: () => <CustomerInfo customer={customer} /> },
    {
      key: "available",
      render: () => (
        <AvailableRewardsList rewards={availableRewards} onRedeem={redeem} />
      ),
    },
    {
      key: "redeemed",
      render: () => (
        <RedeemedRewardsList
          rewards={redeemedRewards}
          onUndoRedeem={undoRedeem}
        />
      ),
    },
  ];

  return (
    <>
      <Stack.Screen options={{ title: customer.name }} />
      <View className="flex-1 bg-white">
        <FlatList
          data={sections}
          renderItem={({ item }) => <View className="p-4">{item.render()}</View>}
          keyExtractor={(item) => item.key}
          ListFooterComponent={<View className="h-28" />}
          showsVerticalScrollIndicator={false}
        />

        <EntityActions
          onDelete={handleDelete}
          onEdit={() => router.push(`/customers/${customerId}/edit`)}
        />
      </View>
    </>
  );
}
