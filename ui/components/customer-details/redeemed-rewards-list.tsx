import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { AppButton } from "@/ui/components/app-button";
import { View, Text, FlatList } from "react-native";

interface Props {
  rewards: Reward[];
  onUndoRedeem: (id: number) => void;
}

export function RedeemedRewardsList({ rewards, onUndoRedeem }: Props) {
  return (
    <View>
      <Text>Recompensas resgatadas</Text>
      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.id!.toString()}
        renderItem={({ item: reward }) => (
          <View>
            <Text>
              {reward.name} - {reward.pointsRequired} pontos
            </Text>
            {reward.isActive === RewardStatus.Active && (
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
