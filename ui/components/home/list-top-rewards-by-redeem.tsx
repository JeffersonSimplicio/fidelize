import { TopRewardDto } from "@/core/application/dtos/customer-rewards";
import { Link } from "expo-router";
import { FlatList, View, Text } from "react-native";

type Props = {
  topRewards: TopRewardDto[];
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
            {item.redeemedCount < 2 ? (
              <Text>Foi resgatada {item.redeemedCount} vez.</Text>
            ) : (
              <Text>Foi resgatada {item.redeemedCount} vezes.</Text>
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
