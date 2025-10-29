import { registerRewardSchema } from "@/core/infrastructure/validation/zod/schemas";
import { AppButton } from "@/ui/components/app-button";
import { NumberInput } from "@/ui/components/number-input";
import { useRealtimeFieldValidation } from "@/ui/hooks/use-realtime-form-validation";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { makeRegisterReward } from "@/core/factories/reward";

const MIN_POINTS_REQUIRED = 1;

export default function NewRewardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pointsRequired: MIN_POINTS_REQUIRED,
  });

  const nameValidation = useRealtimeFieldValidation(
    registerRewardSchema.shape.name,
    form.name
  );
  const descriptionValidation = useRealtimeFieldValidation(
    registerRewardSchema.shape.description,
    form.description
  );
  const pointsRequiredValidation = useRealtimeFieldValidation(
    registerRewardSchema.shape.pointsRequired,
    form.pointsRequired
  );

  const isFormInvalid =
    !!nameValidation.error ||
    !!descriptionValidation.error ||
    form.name.trim() === "" ||
    form.description.trim() === "";

  async function handleAddReward() {
    try {
      setLoading(true);
      const newReward = await makeRegisterReward().execute({
        name: form.name,
        pointsRequired: form.pointsRequired,
        description: form.description,
      });
      Alert.alert("Sucesso", "Recompensa cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace(`/rewards/${newReward.id}`),
        },
      ]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        "Erro",
        `Não foi possível cadastrar a recompensa.\n\n${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Cadastrar Recompensa" }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-white"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800">
              Cadastro Nova Recompensa
            </Text>
          </View>

          {/* Campo Nome */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1 font-medium">Título</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base"
              placeholder="Digite o título da recompensa"
              value={form.name}
              onChangeText={(value) => {
                setForm({ ...form, name: value });
                nameValidation.setTouched();
              }}
            />
            {nameValidation.error && (
              <Text className="text-red-500 mt-1 text-sm">
                {nameValidation.error}
              </Text>
            )}
          </View>

          {/* Campo Pontos */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1 font-medium">
              Pontos necessários
            </Text>
            <NumberInput
              minValue={MIN_POINTS_REQUIRED}
              onValueChange={(value) => {
                setForm({ ...form, pointsRequired: value });
                pointsRequiredValidation.setTouched();
              }}
            />
            {pointsRequiredValidation.error && (
              <Text className="text-red-500 mt-1 text-sm">
                {pointsRequiredValidation.error}
              </Text>
            )}
          </View>

          {/* Campo Descrição */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-1 font-medium">Descrição</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base text-justify"
              placeholder="Digite a descrição da recompensa"
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={(value) => {
                setForm({ ...form, description: value });
                descriptionValidation.setTouched();
              }}
            />
            {descriptionValidation.error && (
              <Text className="text-red-500 mt-1 text-sm">
                {descriptionValidation.error}
              </Text>
            )}
          </View>

          {/* Botão */}
          <AppButton
            onPress={handleAddReward}
            disabled={loading || isFormInvalid}
            className={`p-4 rounded-lg ${
              loading || isFormInvalid
                ? "bg-gray-400"
                : "bg-blue-600 active:opacity-80"
            }`}
          >
            <Text className="text-white font-bold text-base">
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Text>
          </AppButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
