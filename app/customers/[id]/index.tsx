import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { customersDb } from "@/database/customersDb";
import { Customer } from "@/interfaces/customer";
import DeleteButton from "@/components/delete-button";
import { AppButton } from "@/components/app-button";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function CustomerDetailsScreen() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const route = useRouter();
  const { id } = useLocalSearchParams();

  const startEditing = () => {
    if (!customer) return;
    setEditedName(customer.name);
    setEditedPhone(customer.phone);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditedName("");
    setEditedPhone("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!customer) return;
    const updatedCustomer = { ...customer, name: editedName, phone: editedPhone };
    await customersDb.update(parseInt(id as string, 10), updatedCustomer);
    setCustomer(updatedCustomer);
    setEditedName("");
    setEditedPhone("");
    setIsEditing(false);
    Alert.alert("Dados atualizados com sucesso!");
  };

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
    <GestureHandlerRootView >
      <Stack.Screen
        options={{
          title: customer.name,
        }}
      />
      <View style={styles.container}>
        <Text>Client</Text>
        {/* Nome */}
        {isEditing ? (
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
          />
        ) : (
          <Text>Name: {customer.name}</Text>
        )}
  
        {/* Telefone */}
        {isEditing ? (
          <TextInput
            value={editedPhone}
            onChangeText={setEditedPhone}
          />
        ) : (
          <Text>Phone: {customer.phone}</Text>
        )}

         {/* Pontos e última visita continuam visíveis */}
        <Text>Points: {customer.points}</Text>
        <Text>Last Visit: {customer.lastVisitAt}</Text>

        {/* Botões */}
        {isEditing ? (
          <View>
            <AppButton onPress={handleSave}>
              <FontAwesome name="save" size={30} color="black" />
            </AppButton>
            <AppButton onPress={handleCancelEditing}>
              <MaterialIcons name="cancel" size={30} color="black" />
            </AppButton>
          </View>
        ) : (
          <View>
            <DeleteButton onDelete={handleDelete} size={30} />
            <AppButton onPress={startEditing} >
              <FontAwesome name="edit" size={30} color="black" />
            </AppButton>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
