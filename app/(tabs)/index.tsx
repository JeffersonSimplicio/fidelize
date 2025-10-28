import { TopCustomersByPoints, TopRewardsByRedeem } from "@/ui/components/home";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { makeListTopCustomersByPoints } from "@/core/factories/customer";
import { makeListTopRewardByRedeem } from "@/core/factories/customer-reward";
import { CustomerDto } from "@/core/application/dtos/customers";
import { TopRewardDto } from "@/core/application/dtos/customer-rewards";

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
      fetchTopCustomers();
      fetchTopRewards();
    }, [fetchTopCustomers, fetchTopRewards])
  );

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Painel de Fidelidade
      </Text>

      <TopCustomersByPoints customers={customers} />
      <View className="h-4" />
      <TopRewardsByRedeem topRewards={topReward} />
    </View>
  );
}
