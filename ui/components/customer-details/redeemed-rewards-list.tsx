import { CustomerRedeemedRewardDto } from "@/core/application/dtos";
import { AppButton } from "@/ui/components/app-button";
import { formatDate } from "@/ui/utils/format-date";
import { View, Text, FlatList } from "react-native";

interface Props {
  rewards: CustomerRedeemedRewardDto[];
  onUndoRedeem: (id: number) => void;
}

export function RedeemedRewardsList({ rewards, onUndoRedeem }: Props) {
  return (
    <View>
      <Text>Recompensas resgatadas</Text>
      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.reward.id!.toString()}
        renderItem={({ item: {reward, redeemedAt} }) => (
          <View>
            <Text>
              {reward.name} - {reward.pointsRequired} pontos
            </Text>
            <Text>Resgatado em: {formatDate(redeemedAt)}</Text>
            {reward.isActive && (
              <AppButton onPress={() => onUndoRedeem(reward.id!)}>
                <Text>Desfazer resgate</Text>
              </AppButton>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Nenhuma recompensa foi resgatada.</Text>
          </View>
        )}
      />
    </View>
  );
}
