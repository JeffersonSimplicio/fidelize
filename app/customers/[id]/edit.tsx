import { AppButton } from "@/ui/components/app-button";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Text,
  Alert,
} from "react-native";
// import { customersDb } from "@/database_old/customersDb";
// import { Customer } from "@/interfaces/customer";
import { getCustomerDetail } from "@/core/composition/customers/get-customer-detail";
import { editCustomerDetail } from "@/core/composition/customers/edit-customer-detail";
import { Customer } from "@/core/domain/customers/customer.entity";

export default function CustomerEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      const fetchedCustomer = await getCustomerDetail.execute(
        parseInt(id as string, 10)
      );
      if (fetchedCustomer) {
        setCustomer(fetchedCustomer);
        setName(fetchedCustomer.name);
        setPhone(fetchedCustomer.phone);
        setPoints(fetchedCustomer.points);
      }
    };

    fetchCustomers();
  }, [id]);

  const increasePoints = () => setPoints((prev) => prev + 1);
  const decreasePoints = () => setPoints((prev) => (prev > 0 ? prev - 1 : 0));

  const handlePointsChange = (text: string) => {
    const numericValue = parseInt(text, 10);
    if (isNaN(numericValue) || numericValue < 0) {
      setPoints(0);
    } else {
      setPoints(numericValue);
    }
  };

  const handleSave = async () => {
    if (!customer) return;
    const updatedCustomer = { ...customer, name, phone, points };
    await editCustomerDetail.execute(
      parseInt(id as string, 10),
      updatedCustomer
    );
    Alert.alert("Dados atualizados com sucesso!");
    router.back();
  };

  const handleCancelEditing = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar Cliente",
        }}
      />
      <View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View>
            <Text>Editar Cliente</Text>
          </View>
          <View>
            <Text>Nome:</Text>
            <TextInput
              placeholder="Digite o nome do cliente"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View>
            <Text>Telefone:</Text>
            <TextInput
              placeholder="Digite o telefone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View>
            <AppButton onPress={decreasePoints}>
              <AntDesign name="minus" size={24} color="black" />
            </AppButton>

            <TextInput
              keyboardType="numeric"
              value={points.toString()}
              onChangeText={handlePointsChange}
            />
            <AppButton onPress={increasePoints}>
              <AntDesign name="plus" size={24} color="black" />
            </AppButton>
          </View>

          <View>
            <AppButton onPress={handleSave}>
              <FontAwesome name="save" size={30} color="black" />
            </AppButton>
            <AppButton onPress={handleCancelEditing}>
              <MaterialIcons name="cancel" size={30} color="black" />
            </AppButton>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
