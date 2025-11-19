import { RewardDto } from "@/core/application/dtos";
import { formatDate } from "@/ui/utils/format-date";
import { View, Text } from "react-native";

export function RewardInfo({ reward }: { reward: RewardDto }) {
  return (
    <View className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">
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
