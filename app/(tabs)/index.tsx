import { listTopRewardsByRedeem } from "@/core/composition/customer-rewards";
import { listTopCustomersByPoints } from "@/core/composition/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { TopCustomersByPoints, TopRewardsByRedeem } from "@/ui/components/home";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface TopRewardByRedeem {
  reward: Reward;
  amount: number;
}

export default function HomeScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [topReward, setTopReward] = useState<TopRewardByRedeem[]>([]);

  const fetchTopCustomers = useCallback(async () => {
    const customers = await listTopCustomersByPoints.execute(3);
    setCustomers(customers);
  }, []);

  const fetchTopRewards = useCallback(async () => {
    const topReward = await listTopRewardsByRedeem.execute(3);
    setTopReward(topReward);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTopCustomers();
      fetchTopRewards();
    }, [fetchTopCustomers, fetchTopRewards])
  );

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <TopCustomersByPoints customers={customers} />
      <TopRewardsByRedeem topRewards={topReward} />
      <Link href={"/debug/customer-debug"}>Debug</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
