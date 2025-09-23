import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Customer } from "../../interfaces/customers";
import { customersDb } from "../../database/customersDb";
import { useState, useEffect } from "react";

export default function Details() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchCustomers = async () => {
      const fetchedCustomer = await customersDb.getById(
        parseInt(id as string, 10)
      );
      setCustomer(fetchedCustomer ?? null);
    };

    fetchCustomers();
  }, [id]);

  if (!customer) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Detalhes',
          }}
        />
        <View style={styles.container}>
          <Text>User not found</Text>
        </View>
      </>
      
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: customer.name,
        }}
      />
      <View style={styles.container}>
        <Text>Client</Text>
        <Text>Name: {customer.name}</Text>
        <Text>Phone: {customer.phone}</Text>
        <Text>Points: {customer.points}</Text>
        <Text>Last Visit: {customer.lastVisitAt}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
