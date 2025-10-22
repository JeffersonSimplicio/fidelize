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
    <View>
      <Text>Clientes que já resgataram</Text>
      <FlatList
        data={customers}
        keyExtractor={(customer) => customer.customer.id!.toString()}
        renderItem={({ item: { customer, redeemedAt } }) => (
          <View>
            <Text>
              {customer.name} - {customer.points} pontos
            </Text>
            <Text>Resgatado em {formatDate(redeemedAt)}</Text>
            {isActive && (
              <AppButton onPress={() => onUndoRedeem(customer.id!)}>
                <Text>Desfazer resgate</Text>
              </AppButton>
            )}
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
