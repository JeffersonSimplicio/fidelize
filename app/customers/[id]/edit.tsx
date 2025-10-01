import { AppButton } from "@/ui/components/app-button";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
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
import { getCustomerDetail } from "@/core/composition/customers/get-customer-detail";
import { editCustomerDetail } from "@/core/composition/customers/edit-customer-detail";
import { Customer } from "@/core/domain/customers/customer.entity";
import { NumberInput } from "@/ui/components/number-input";

const MIN_POINTS = 0;

export default function CustomerEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [points, setPoints] = useState<number>(MIN_POINTS);

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
            <Text>Pontos:</Text>
            <NumberInput
              minValue={MIN_POINTS}
              initValue={points}
              onValueChange={setPoints}
            />
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
