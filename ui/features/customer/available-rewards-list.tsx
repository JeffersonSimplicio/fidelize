import { View, Text, FlatList } from 'react-native';

import { RewardDto } from '@/core/application/dtos';
import { AppButton } from '@/ui/components/app-button';

interface Props {
  rewards: RewardDto[];
  onRedeem: (id: number) => void;
}

export function AvailableRewardsList({ rewards, onRedeem }: Props) {
  return (
    <View className="mb-4 rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold text-gray-800">
        🎁 Recompensas disponíveis
      </Text>

      <FlatList
        data={rewards}
        keyExtractor={(reward) => reward.id!.toString()}
        renderItem={({ item: reward }) => (
          <View className="mb-2 rounded-lg border border-gray-200 bg-white p-3">
            <Text className="font-medium text-gray-800">{reward.name}</Text>
            <Text className="mb-2 text-gray-600">
              {reward.pointsRequired} pontos
            </Text>
            <AppButton
              onPress={() => onRedeem(reward.id!)}
              className="rounded-lg bg-blue-600 px-4 py-2"
            >
              <Text className="font-semibold text-white">Resgatar</Text>
            </AppButton>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="mt-4 items-center">
            <Text className="text-gray-500">
              Não há recompensas a resgatar.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
