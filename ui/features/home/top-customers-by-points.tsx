import { CustomerDto } from "@/core/application/dtos";
import { FlatList, View, Text } from "react-native";
import { ListItemCard } from "@/ui/components/list-item-card";

interface Props {
  customers: CustomerDto[];
}

export function TopCustomersByPoints({ customers }: Props) {
  return (
    <View className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
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
          <View className="items-center mt-3">
            <Text className="text-gray-500">Nenhum cliente cadastrado.</Text>
          </View>
        )}
      />
    </View>
  );
}
