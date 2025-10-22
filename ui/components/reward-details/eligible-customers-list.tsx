import { CustomerDto } from "@/core/application/dtos";
import { AppButton } from "@/ui/components/app-button";
import { View, Text, FlatList } from "react-native";

interface Props {
  customers: CustomerDto[];
  onRedeem: (id: number) => void;
}

export function EligibleCustomersList({ customers, onRedeem }: Props) {
  return (
    <View>
      <Text>Clientes elegíveis a resgatar</Text>
      <FlatList
        data={customers}
        keyExtractor={(customer) => customer.id!.toString()}
        renderItem={({ item: customer }) => (
          <View>
            <Text>
              {customer.name} - {customer.points} pontos
            </Text>
            <AppButton onPress={() => onRedeem(customer.id!)}>
              <Text>Resgatar</Text>
            </AppButton>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Não há clientes elegíveis a resgatar.</Text>
          </View>
        )}
      />
    </View>
  );
}
