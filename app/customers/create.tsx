import { registerCustomer } from "@/core/composition/customers/commands/register-customer";
import { registerCustomerSchema } from "@/core/infrastructure/validation/zod/schemas";
import { AppButton } from "@/ui/components/app-button";
import { PhoneInput } from "@/ui/components/phone-input";
import { useRealtimeFieldValidation } from "@/ui/hooks/use-realtime-form-validation";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function NewCustomerScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const nameValidation = useRealtimeFieldValidation(
    registerCustomerSchema.shape.name,
    form.name
  );
  const phoneValidation = useRealtimeFieldValidation(
    registerCustomerSchema.shape.phone,
    form.phone,
    1000
  );

  const isFormInvalid =
    !!nameValidation.error ||
    !!phoneValidation.error ||
    form.name.trim() === "" ||
    form.phone.trim() === "";

  async function handleAddCustomer() {
    try {
      setLoading(true);
      const newCustomer = await registerCustomer.execute(form);
      Alert.alert("Sucesso", "Cliente cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace(`/customers/${newCustomer.id}`),
        },
      ]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        "Erro",
        `Não foi possível cadastrar o cliente.\n\n ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cadastrar Cliente",
        }}
      />
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
              value={form.name}
              onChangeText={(value) => {
                setForm({ ...form, name: value });
                nameValidation.setTouched();
              }}
            />
            {nameValidation.error && (
              <Text style={{ color: "red" }}>{nameValidation.error}</Text>
            )}
          </View>
          <View>
            <Text>Telefone:</Text>
            <PhoneInput
              value={form.phone}
              onChange={(value) => {
                setForm({ ...form, phone: value });
                phoneValidation.setTouched();
              }}
            />
            {phoneValidation.error && (
              <Text style={{ color: "red" }}>{phoneValidation.error}</Text>
            )}
          </View>
          <AppButton
            onPress={handleAddCustomer}
            disabled={loading || isFormInvalid}
            style={({ pressed }) => [
              styles.default,
              (loading || isFormInvalid) && styles.disabled,
              pressed && !(loading || isFormInvalid) && { opacity: 0.6 },
            ]}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </AppButton>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  default: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF", // cor ativa
  },
  disabled: {
    backgroundColor: "#ccc", // cor quando desabilitado
  },
});
