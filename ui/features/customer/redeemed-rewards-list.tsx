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
    <View className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        🪙 Recompensas resgatadas
      </Text>

      <FlatList
        data={rewards}
        keyExtractor={(r) => r.reward.id!.toString()}
        renderItem={({ item: { reward, redeemedAt } }) => (
          <View className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
            <Text className="text-gray-800 font-medium">{reward.name}</Text>
            <Text className="text-gray-600 mb-1">
              {reward.pointsRequired} pontos
            </Text>
            <Text className="text-gray-500 mb-2">
              Resgatado em {formatDate(redeemedAt)}
            </Text>
            {reward.isActive && (
              <AppButton
                onPress={() => onUndoRedeem(reward.id!)}
                className="bg-red-600 py-2 px-4 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  Desfazer resgate
                </Text>
              </AppButton>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-4">
            <Text className="text-gray-500">
              Nenhuma recompensa foi resgatada.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
