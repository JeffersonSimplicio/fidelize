import { FlatList, View, Text } from 'react-native';

import { CustomerDto } from '@/core/application/dtos';
import { ListItemCard } from '@/ui/components/list-item-card';

interface Props {
  customers: CustomerDto[];
}

export function TopCustomersByPoints({ customers }: Props) {
  return (
    <View className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold text-gray-800">
        🏅 Top 3 clientes mais fiéis
      </Text>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <ListItemCard
            href={`/customers/${item.id}`}
            title={item.name}
            subtitle={`${item.points} pontos`}
            variant="outlined"
          />
        )}
        ListEmptyComponent={() => (
          <View className="mt-3 items-center">
            <Text className="text-gray-500">Nenhum cliente cadastrado.</Text>
          </View>
        )}
      />
    </View>
  );
}
