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
import { NumberInput } from "@/ui/components/number-input";
import { PhoneInput } from "@/ui/components/phone-input";
import { useRealtimeFieldValidation } from "@/ui/hooks/use-realtime-form-validation";
import { editCustomerSchema } from "@/core/infrastructure/validation/zod/schemas";

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
      const fetchedCustomer = await getCustomerDetail.execute(
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
      await editCustomerDetail.execute(
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

          <View>
            <Text>Pontos:</Text>
            <NumberInput
              minValue={MIN_POINTS}
              initValue={form.points}
              onValueChange={(value) => {
                setForm({ ...form, points: value });
                pointsValidation.setTouched();
              }}
            />
            {pointsValidation.error && (
              <Text style={{ color: "red" }}>{pointsValidation.error}</Text>
            )}
          </View>

          <View>
            <AppButton disabled={loading} onPress={handleSave}>
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
