import { View, Text, FlatList } from 'react-native';

import { CustomerDto } from '@/core/application/dtos';
import { AppButton } from '@/ui/components/app-button';

interface Props {
  customers: CustomerDto[];
  onRedeem: (id: number) => void;
}

export function EligibleCustomersList({ customers, onRedeem }: Props) {
  return (
    <View className="mb-4 rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold text-gray-800">
        Clientes elegíveis a resgatar
      </Text>
      <FlatList
        data={customers}
        keyExtractor={(customer) => customer.id!.toString()}
        renderItem={({ item: customer }) => (
          <View className="mb-2 rounded-lg border border-gray-200 bg-white p-3">
            <Text className="font-medium text-gray-800">{customer.name}</Text>
            <Text className="mb-2 text-gray-600">{customer.points} pontos</Text>
            <AppButton
              className="rounded-lg bg-blue-600 px-4 py-2"
              onPress={() => onRedeem(customer.id!)}
            >
              <Text className="font-semibold text-white">Resgatar</Text>
            </AppButton>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="mt-4 items-center">
            <Text className="text-gray-500">
              Não há clientes elegíveis a resgatar.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
