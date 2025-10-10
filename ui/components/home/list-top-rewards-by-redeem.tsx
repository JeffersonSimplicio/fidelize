import { Reward } from "@/core/domain/rewards/reward.entity";
import { Link } from "expo-router";
import { FlatList, View, Text } from "react-native";

interface TopRewardByRedeem {
  reward: Reward;
  amount: number;
}

type Props = {
  topRewards: TopRewardByRedeem[];
};

export function TopRewardsByRedeem({ topRewards }: Props) {
  return (
    <View>
      <Text>Top 3 recompensas mais resgatadas!</Text>
      <FlatList
        data={topRewards}
        keyExtractor={(item) => item.reward.id!.toString()}
        renderItem={({ item }) => (
          <Link href={`/rewards/${item.reward.id}`}>
            <Text>
              {item.reward.name} - {item.reward.pointsRequired} pontos
            </Text>
            {item.amount < 2 ? (
              <Text>Foi resgatada {item.amount} vez.</Text>
            ) : (
              <Text>Foi resgatada {item.amount} vezes.</Text>
            )}
          </Link>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text>Nenhuma recompensa foi cadastrada.</Text>
          </View>
        )}
      />
    </View>
  );
}
