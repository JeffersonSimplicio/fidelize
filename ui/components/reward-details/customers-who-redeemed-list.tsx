import { Customer } from "@/core/domain/customers/customer.entity";
import { View, Text, FlatList } from "react-native";
import { AppButton } from "@/ui/components/app-button";

interface Props {
  customers: Customer[];
  onUndoRedeem: (id: number) => void;
}

export function CustomersWhoRedeemedList({ customers, onUndoRedeem }: Props) {
  return (
    <View>
      <Text>Clientes que já resgataram</Text>
      <FlatList
        data={customers}
        keyExtractor={(customer) => customer.id!.toString()}
        renderItem={({ item: customer }) => (
          <View>
            <Text>
              {customer.name} - {customer.points} pontos
            </Text>
            <AppButton onPress={() => onUndoRedeem(customer.id!)}>
              <Text>Desfazer resgate</Text>
            </AppButton>
            {/* {customer.isActive === RewardStatus.Active && (
              <AppButton onPress={() => onUndoRedeem(customer.id!)}>
                <Text>Desfazer resgate</Text>
              </AppButton>
            )} */}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Nenhum cliente resgatou essa recompensa.</Text>
          </View>
        )}
      />
    </View>
  );
}
