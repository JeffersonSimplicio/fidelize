import { RewardDto } from "@/core/application/dtos";
import { AppButton } from "@/ui/components/app-button";
import { View, Text, FlatList } from "react-native";

interface Props {
  rewards: RewardDto[];
  onRedeem: (id: number) => void;
}

export function AvailableRewardsList({ rewards, onRedeem }: Props) {
  return (
    <View className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        🎁 Recompensas disponíveis
      </Text>

      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.id!.toString()}
        renderItem={({ item: reward }) => (
          <View className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
            <Text className="text-gray-800 font-medium">{reward.name}</Text>
            <Text className="text-gray-600 mb-2">
              {reward.pointsRequired} pontos
            </Text>
            <AppButton
              onPress={() => onRedeem(reward.id!)}
              className="bg-blue-600 py-2 px-4 rounded-lg"
            >
              <Text className="text-white font-semibold">Resgatar</Text>
            </AppButton>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-4">
            <Text className="text-gray-500">
              Não há recompensas a resgatar.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
