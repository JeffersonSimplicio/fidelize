import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { customersDb } from "../../database/customersDb";
import { Customer } from "../../interfaces/customer";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CustomersScreen() {
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
          <Link href={`/details/customer/${item.id}`}>
            <Text>
              {item.name} - {item.points} pontos
            </Text>
          </Link>
        )}
      />
      <Link href={'/create/customer'}>
        <AntDesign name="user-add" size={24} color="black" />
      </Link>
    </View>
  );
}
