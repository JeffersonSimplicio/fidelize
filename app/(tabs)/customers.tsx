import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { customersDb } from "../../database/customersDb";
import { Customer } from "../../interfaces/customer";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = useCallback(async () => {
    const customers = await customersDb.getAll();
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
          <Link href={`/details/customer/${item.id}`}>
            <Text>
              {item.name} - {item.points} pontos
            </Text>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Link href={"/create/customer"}>
        <AntDesign name="user-add" size={24} color="black" />
      </Link>
    </View>
  );
}
