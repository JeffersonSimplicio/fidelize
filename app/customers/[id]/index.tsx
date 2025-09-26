import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { customersDb } from "@/database_old/customersDb";
import { Customer } from "@/interfaces/customer";
import DeleteButton from "@/ui/components/delete-button";
import { AppButton } from "@/ui/components/app-button";
import { FontAwesome } from "@expo/vector-icons";

export default function CustomerDetailsScreen() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const route = useRouter();
  const { id } = useLocalSearchParams();

  const handleDelete = () => {
    customersDb.remove(parseInt(id as string, 10));
    Alert.alert("Cliente deletado com sucesso!");
    route.back();
  };

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
            title: "Detalhes",
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

        <View>
          <DeleteButton onDelete={handleDelete} size={30} />
          <AppButton
            onPress={() => route.push(`/customers/${customer.id}/edit`)}
          >
            <FontAwesome name="edit" size={30} color="black" />
          </AppButton>
        </View>
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
