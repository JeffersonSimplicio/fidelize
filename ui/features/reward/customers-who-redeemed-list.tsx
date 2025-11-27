import { View, Text, FlatList } from 'react-native';

import { AppButton } from '@/ui/components/app-button';
import { CustomerRewardRedemptionDto } from '@/core/application/dtos/customer-rewards';
import { formatDate } from '@/ui/utils/format-date';

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
    <View className="mb-4 rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold text-gray-800">
        Clientes que já resgataram
      </Text>

      <FlatList
        data={customers}
        keyExtractor={(customer) => customer.customer.id!.toString()}
        renderItem={({ item: { customer, redeemedAt } }) => (
          <View className="mb-2 rounded-lg border border-gray-200 bg-white p-3">
            <Text className="font-medium text-gray-800">{customer.name}</Text>
            <Text className="mb-1 text-gray-600">{customer.points} pontos</Text>
            <Text className="mb-2 text-gray-500">
              Resgatado em {formatDate(redeemedAt)}
            </Text>
            {isActive && (
              <AppButton
                onPress={() => onUndoRedeem(customer.id!)}
                className="rounded-lg bg-red-600 px-4 py-2"
              >
                <Text className="font-semibold text-white">
                  Desfazer resgate
                </Text>
              </AppButton>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="mt-4 items-center">
            <Text className="text-gray-500">
              Nenhum cliente resgatou essa recompensa.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
