import { TopCustomersByPoints, TopRewardsByRedeem } from "@/ui/components/home";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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
