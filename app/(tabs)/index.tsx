import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { makeListTopCustomersByPoints } from '@/core/factories/customer';
import { makeListTopRewardByRedeem } from '@/core/factories/customer-reward';
import { CustomerDto } from '@/core/application/dtos/customers';
import { TopRewardDto } from '@/core/application/dtos/customer-rewards';
import { TopCustomersByPoints, TopRewardsByRedeem } from '@/ui/features/home';

export default function HomeScreen() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [topReward, setTopReward] = useState<TopRewardDto[]>([]);

  const fetchTopCustomers = useCallback(async () => {
    const customers = await makeListTopCustomersByPoints().execute(3);
    setCustomers(customers);
  }, []);

  const fetchTopRewards = useCallback(async () => {
    const topReward = await makeListTopRewardByRedeem().execute(3);
    setTopReward(topReward);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchTopCustomers();
      void fetchTopRewards();
    }, [fetchTopCustomers, fetchTopRewards]),
  );

  const sections = [
    {
      key: 'top_customers',
      render: () => <TopCustomersByPoints customers={customers} />,
    },
    {
      key: 'top_rewards',
      render: () => <TopRewardsByRedeem topRewards={topReward} />,
    },
  ];

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-2xl font-bold text-gray-800">
        Painel de Fidelidade
      </Text>

      <FlatList
        data={sections}
        renderItem={({ item }) => <View className="p-2">{item.render()}</View>}
        keyExtractor={(item) => item.key}
        ListFooterComponent={<View className="h-28" />}
        showsVerticalScrollIndicator={false}
      />

      {__DEV__ && (
        <Link href="/debug/customer-debug" asChild>
          <TouchableOpacity className="absolute bottom-6 right-6 flex-row items-center rounded-full bg-blue-600 p-3 shadow-lg">
            <AntDesign name="tool" size={24} color="white" />
            <Text className="ml-2 font-semibold text-white">Debug</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}
