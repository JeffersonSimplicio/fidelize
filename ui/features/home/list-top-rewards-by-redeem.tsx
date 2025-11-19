import { TopRewardDto } from "@/core/application/dtos/customer-rewards";
import { FlatList, View, Text } from "react-native";
import { ListItemCard } from "@/ui/components/list-item-card";

type Props = {
  topRewards: TopRewardDto[];
};

export function TopRewardsByRedeem({ topRewards }: Props) {
  return (
    <View className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        🎉 Top 3 recompensas mais resgatadas
      </Text>

      <FlatList
        data={topRewards}
        keyExtractor={(item) => item.reward.id!.toString()}
        renderItem={({ item }) => (
          <ListItemCard
            href={`/rewards/${item.reward.id}`}
            title={item.reward.name}
            subtitle={`${item.reward.pointsRequired} pontos necessários`}
            extra={`${item.redeemedCount} ${
              item.redeemedCount === 1 ? "resgate" : "resgates"
            }`}
            variant="outlined"
          />
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-3">
            <Text className="text-gray-500">
              Nenhuma recompensa cadastrada.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
