import { FlatList, View, Text } from 'react-native';

import { TopRewardDto } from '@/core/application/dtos/customer-rewards';
import { ListItemCard } from '@/ui/components/list-item-card';

type Props = {
  topRewards: TopRewardDto[];
};

export function TopRewardsByRedeem({ topRewards }: Props) {
  return (
    <View className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-3 text-lg font-semibold text-gray-800">
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
              item.redeemedCount === 1 ? 'resgate' : 'resgates'
            }`}
            variant="outlined"
          />
        )}
        ListEmptyComponent={() => (
          <View className="mt-3 items-center">
            <Text className="text-gray-500">
              Nenhuma recompensa cadastrada.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
