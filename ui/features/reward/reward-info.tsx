import { View, Text } from 'react-native';

import { RewardDto } from '@/core/application/dtos';
import { formatDate } from '@/ui/utils/format-date';

export function RewardInfo({ reward }: { reward: RewardDto }) {
  return (
    <View className="mb-4 rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-2 text-lg font-semibold text-gray-800">
        Recompensa
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">Nome: {reward.name}</Text>
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">Descrição: {reward.description}</Text>
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">
          Pontos Necessários: {reward.pointsRequired}
        </Text>
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">
          Criado em: {formatDate(reward.createdAt)}
        </Text>
      </Text>
    </View>
  );
}
