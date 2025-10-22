import { CustomerDto } from "@/core/application/dtos";
import { Link } from "expo-router";
import { FlatList, View, Text } from "react-native";

interface Props {
  customers: CustomerDto[];
}

export function TopCustomersByPoints({ customers }: Props) {
  return (
    <View>
      <Text>Top 3 clientes mais fieis!</Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <Link href={`/customers/${item.id}`}>
            <Text>
              {item.name} - {item.points} pontos
            </Text>
          </Link>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text>Nenhum cliente cadastrado.</Text>
          </View>
        )}
      />
    </View>
  );
}
