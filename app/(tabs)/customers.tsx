import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { listCustomers } from "@/core/composition/customers/list-customers";
import { Customer } from "@/core/domain/customers/customer.entity";

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = useCallback(async () => {
    const customers = await listCustomers.execute();
    setCustomers(customers);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Lista de Clientes
      </Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/customers/${item.id}`}>
            <Text>
              {item.name} - {item.points} pontos
            </Text>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Link href={"/customers/create"}>
        <AntDesign name="user-add" size={24} color="black" />
      </Link>
    </View>
  );
}
