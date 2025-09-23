import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Button,
} from "react-native";
import { customersDb } from "../../database/customersDb";
import { useRouter } from "expo-router";

export default function NewCustomerScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddCustomer() {
    if (name.trim() === "" || phone.trim() === "") {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      const newCustomer = await customersDb.add({
        name,
        phone,
      });
      console.log("New customer added with ID:", newCustomer.id);
      Alert.alert("Sucesso", "Cliente cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace(`/details/customer/${newCustomer.id}`),
        },
      ]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        "Erro",
        `Não foi possível cadastrar o cliente.\n ${errorMessage}`
      );
    }
  }

  return (
    <View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View>
          <Text>Cadastro Novo Cliente</Text>
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
        <Button
          onPress={handleAddCustomer}
          disabled={loading}
          title={loading ? "Cadastrando..." : "Cadastrar"}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
