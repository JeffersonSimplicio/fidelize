import { Reward } from "@/core/domain/rewards/reward.entity";
import { View, Text } from "react-native";

export function CustomerInfo({ reward }: { reward: Reward }) {
  return (
    <View>
      <Text>Recompensa</Text>
      <Text>Nome: {reward.name}</Text>
      <Text>Descrição: {reward.description}</Text>
      <Text>Pontos Necessários: {reward.pointsRequired}</Text>
      <Text>Criado em: {reward.createdAt.toLocaleDateString("pt-BR")}</Text>
    </View>
  );
}
