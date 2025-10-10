import { listTopCustomersByPoints } from "@/core/composition/customers";
import { Customer } from "@/core/domain/customers/customer.entity";
import { TopCustomersByPoints } from "@/ui/components/home/top-customers-by-points";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = useCallback(async () => {
    const customers = await listTopCustomersByPoints.execute(3);
    setCustomers(customers);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers])
  );

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <TopCustomersByPoints customers={customers} />
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
