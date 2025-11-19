import { CustomerDto } from "@/core/application/dtos";
import { AppButton } from "@/ui/components/app-button";
import { View, Text, FlatList } from "react-native";

interface Props {
  customers: CustomerDto[];
  onRedeem: (id: number) => void;
}

export function EligibleCustomersList({ customers, onRedeem }: Props) {
  return (
    <View className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        Clientes elegíveis a resgatar
      </Text>
      <FlatList
        data={customers}
        keyExtractor={(customer) => customer.id!.toString()}
        renderItem={({ item: customer }) => (
          <View className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
            <Text className="text-gray-800 font-medium">{customer.name}</Text>
            <Text className="text-gray-600 mb-2">{customer.points} pontos</Text>
            <AppButton
              className="bg-blue-600 py-2 px-4 rounded-lg"
              onPress={() => onRedeem(customer.id!)}
            >
              <Text className="text-white font-semibold">Resgatar</Text>
            </AppButton>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-4">
            <Text className="text-gray-500">
              Não há clientes elegíveis a resgatar.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
