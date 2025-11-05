import { editCustomerSchema } from "@/core/infrastructure/validation/zod/schemas";
import { NumberInput } from "@/ui/components/number-input";
import { PhoneInput } from "@/ui/components/phone-input";
import { useRealtimeFieldValidation } from "@/ui/hooks/use-realtime-form-validation";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  makeEditCustomer,
  makeGetCustomerDetail,
} from "@/core/factories/customer";
import { EditActions } from "@/ui/components/edit-actions";

const MIN_POINTS = 0;

export default function CustomerEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    points: MIN_POINTS,
  });
  const [loading, setLoading] = useState(false);

  const nameValidation = useRealtimeFieldValidation(
    editCustomerSchema.shape.name,
    form.name
  );
  const phoneValidation = useRealtimeFieldValidation(
    editCustomerSchema.shape.phone,
    form.phone,
    1000
  );
  const pointsValidation = useRealtimeFieldValidation(
    editCustomerSchema.shape.points,
    form.points
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      const fetchedCustomer = await makeGetCustomerDetail().execute(
        parseInt(id as string, 10)
      );
      if (fetchedCustomer) {
        setForm({
          name: fetchedCustomer.name,
          phone: fetchedCustomer.phone,
          points: fetchedCustomer.points,
        });
      }
    };

    fetchCustomers();
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedCustomer = { ...form };
      await makeEditCustomer().execute(
        parseInt(id as string, 10),
        updatedCustomer
      );
      Alert.alert("Dados atualizados com sucesso!");
      router.back();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        "Erro",
        `Não foi possível atualizar os dados do cliente.\n\n ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-white"
      >
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-xl font-semibold text-gray-800 mb-4">
            Editar Cliente
          </Text>

          {/* Nome */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Nome:</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              placeholder="Digite o nome do cliente"
              value={form.name}
              onChangeText={(value) => {
                setForm({ ...form, name: value });
                nameValidation.setTouched();
              }}
            />
            {nameValidation.error && (
              <Text className="text-red-500 text-sm mt-1">
                {nameValidation.error}
              </Text>
            )}
          </View>

          {/* Telefone */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Telefone:</Text>
            <PhoneInput
              value={form.phone}
              onChange={(value) => {
                setForm({ ...form, phone: value });
                phoneValidation.setTouched();
              }}
            />
            {phoneValidation.error && (
              <Text className="text-red-500 text-sm mt-1">
                {phoneValidation.error}
              </Text>
            )}
          </View>

          {/* Pontos */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-1">Pontos:</Text>
            <NumberInput
              minValue={MIN_POINTS}
              initValue={form.points}
              onValueChange={(value) => {
                setForm({ ...form, points: value });
                pointsValidation.setTouched();
              }}
            />
            {pointsValidation.error && (
              <Text className="text-red-500 text-sm mt-1">
                {pointsValidation.error}
              </Text>
            )}
          </View>

          {/* Botões */}
          <EditActions
            isLoading={loading}
            onSave={handleSave}
            onCancel={handleCancelEditing}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
