import { Reward } from "@/core/domain/rewards/reward.entity";
import { AppButton } from "@/ui/components/app-button";
import { View, Text, FlatList } from "react-native";

interface Props {
  rewards: Reward[];
  onRedeem: (id: number) => void;
}

export function AvailableRewardsList({ rewards, onRedeem }: Props) {
  return (
    <View>
      <Text>Recompensas disponíveis</Text>
      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.id!.toString()}
        renderItem={({ item: reward }) => (
          <View>
            <Text>
              {reward.name} - {reward.pointsRequired} pontos
            </Text>
            <AppButton onPress={() => onRedeem(reward.id!)}>
              <Text>Resgatar</Text>
            </AppButton>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Não há recompensas a resgatar.</Text>
          </View>
        )}
      />
    </View>
  );
}
