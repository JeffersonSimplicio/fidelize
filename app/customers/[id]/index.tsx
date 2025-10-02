import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DeleteButton from "@/ui/components/delete-button";
import { AppButton } from "@/ui/components/app-button";
import { getCustomerDetail } from "@/core/composition/customers/get-customer-detail";
import { deleteCustomer } from "@/core/composition/customers/delete-customer";
import { Customer } from "@/core/domain/customers/customer.entity";

const formatPhone = (phone: string): string => {
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
};

export default function CustomerDetailsScreen() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const route = useRouter();
  const { id } = useLocalSearchParams();

  const handleDelete = async () => {
    await deleteCustomer.execute(parseInt(id as string, 10));
    Alert.alert("Cliente deletado com sucesso!");
    route.back();
  };

  const fetchCustomers = useCallback(async () => {
    const fetchedCustomer = await getCustomerDetail.execute(
      parseInt(id as string, 10)
    );
    setCustomer(fetchedCustomer ?? null);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers])
  );

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
        <Text>Cliente</Text>
        <Text>Name: {customer.name}</Text>
        <Text>Telefone: {formatPhone(customer.phone)}</Text>
        <Text>Pontos acumulados: {customer.points}</Text>
        <Text>
          Ultima Visita: {customer.lastVisitAt.toLocaleDateString("pt-BR")}
        </Text>

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
