import { CustomerDto } from "@/core/application/dtos";
import { Link } from "expo-router";
import { FlatList, View, Text, TouchableOpacity } from "react-native";

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
          <Link href={`/customers/${item.id}`} asChild>
            <TouchableOpacity className="p-3 mb-2 bg-white rounded-lg border border-gray-200 active:bg-gray-100">
              <Text className="text-gray-800 font-medium">{item.name}</Text>
              <Text className="text-gray-600">{item.points} pontos</Text>
            </TouchableOpacity>
          </Link>
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
