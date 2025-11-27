import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Text, View } from 'react-native';

import { useRewardDetails } from '@/ui/hooks/reward-details/use-reward-details';
import {
  CustomersWhoRedeemedList,
  EligibleCustomersList,
  RewardInfo,
} from '@/ui/features/reward';
import { EntityActions } from '@/ui/components/entity-actions';

export default function RewardDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const rewardId = parseInt(id as string, 10);

  const {
    reward,
    eligibleCustomers,
    customersWhoRedeemed,
    reloadAll,
    handleDelete,
    redeem,
    undoRedeem,
  } = useRewardDetails(rewardId, () => router.back());

  useFocusEffect(
    useCallback(() => {
      reloadAll();
    }, [reloadAll]),
  );

  if (!reward) {
    return (
      <>
        <Stack.Screen options={{ title: 'Detalhes' }} />
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-base text-gray-600">
            Recompensa não foi encontrada!
          </Text>
        </View>
      </>
    );
  }

  const sections = [
    { key: 'info', render: () => <RewardInfo reward={reward} /> },
    {
      key: 'eligible',
      render: () => (
        <EligibleCustomersList
          customers={eligibleCustomers}
          onRedeem={redeem}
        />
      ),
    },
    {
      key: 'redeemed',
      render: () => (
        <CustomersWhoRedeemedList
          customers={customersWhoRedeemed}
          onUndoRedeem={undoRedeem}
          isActive={reward.isActive}
        />
      ),
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: reward.name,
        }}
      />
      <View className="flex-1 bg-white">
        <FlatList
          data={sections}
          renderItem={({ item }) => (
            <View className="p-4">{item.render()}</View>
          )}
          keyExtractor={(item) => item.key}
          ListFooterComponent={<View className="h-28" />}
          showsVerticalScrollIndicator={false}
        />

        <EntityActions
          onDelete={handleDelete}
          onEdit={() => router.push(`/rewards/${rewardId}/edit`)}
        />
      </View>
    </>
  );
}
