import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Customer } from "../../interfaces/customers";
import { customersDb } from "../../database/customersDb";
import { Link } from "expo-router";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const customers = await customersDb.getAll();
      setCustomers(customers);
    };

    fetchCustomers();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Lista de Clientes
      </Text>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/details/${item.id}`}>
            <Text>
              {item.name} - {item.points} pontos
            </Text>
          </Link>
        )}
      />
    </View>
  );
}
