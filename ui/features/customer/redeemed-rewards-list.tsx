import { View, Text, FlatList } from 'react-native';

import { CustomerRedeemedRewardDto } from '@/core/application/dtos';
import { AppButton } from '@/ui/components/app-button';
import { formatDate } from '@/ui/utils/format-date';

interface Props {
  rewards: CustomerRedeemedRewardDto[];
  onUndoRedeem: (id: number) => void;
}

export function RedeemedRewardsList({ rewards, onUndoRedeem }: Props) {
  return (
    <View className="mb-4 rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold text-gray-800">
        🪙 Recompensas resgatadas
      </Text>

      <FlatList
        data={rewards}
        keyExtractor={(r) => r.reward.id!.toString()}
        renderItem={({ item: { reward, redeemedAt } }) => (
          <View className="mb-2 rounded-lg border border-gray-200 bg-white p-3">
            <Text className="font-medium text-gray-800">{reward.name}</Text>
            <Text className="mb-1 text-gray-600">
              {reward.pointsRequired} pontos
            </Text>
            <Text className="mb-2 text-gray-500">
              Resgatado em {formatDate(redeemedAt)}
            </Text>
            {reward.isActive && (
              <AppButton
                onPress={() => onUndoRedeem(reward.id!)}
                className="rounded-lg bg-red-600 px-4 py-2"
              >
                <Text className="font-semibold text-white">
                  Desfazer resgate
                </Text>
              </AppButton>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="mt-4 items-center">
            <Text className="text-gray-500">
              Nenhuma recompensa foi resgatada.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
