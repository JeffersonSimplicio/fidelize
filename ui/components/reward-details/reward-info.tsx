import { RewardDto } from "@/core/application/dtos";
import { formatDate } from "@/ui/utils/format-date";
import { View, Text } from "react-native";

export function CustomerInfo({ reward }: { reward: RewardDto }) {
  return (
    <View>
      <Text>Recompensa</Text>
      <Text>Nome: {reward.name}</Text>
      <Text>Descrição: {reward.description}</Text>
      <Text>Pontos Necessários: {reward.pointsRequired}</Text>
      <Text>Criado em: {formatDate(reward.createdAt)}</Text>
    </View>
  );
}
