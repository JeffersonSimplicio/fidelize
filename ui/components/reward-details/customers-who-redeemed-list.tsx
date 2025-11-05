import { View, Text, FlatList } from "react-native";
import { AppButton } from "@/ui/components/app-button";
import { CustomerRewardRedemptionDto } from "@/core/application/dtos/customer-rewards";
import { formatDate } from "@/ui/utils/format-date";

interface Props {
  customers: CustomerRewardRedemptionDto[];
  onUndoRedeem: (id: number) => void;
  isActive: boolean;
}

export function CustomersWhoRedeemedList({
  customers,
  onUndoRedeem,
  isActive,
}: Props) {
  return (
    <View className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Clientes que já resgataram
      </Text>

      <FlatList
        data={customers}
        keyExtractor={(customer) => customer.customer.id!.toString()}
        renderItem={({ item: { customer, redeemedAt } }) => (
          <View className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
            <Text className="text-gray-800 font-medium">{customer.name}</Text>
            <Text className="text-gray-600 mb-1">{customer.points} pontos</Text>
            <Text className="text-gray-500 mb-2">
              Resgatado em {formatDate(redeemedAt)}
            </Text>
            {isActive && (
              <AppButton
                onPress={() => onUndoRedeem(customer.id!)}
                className="bg-red-600 py-2 px-4 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  Desfazer resgate
                </Text>
              </AppButton>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-4">
            <Text className="text-gray-500">
              Nenhum cliente resgatou essa recompensa.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
