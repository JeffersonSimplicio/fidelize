import { editRewardSchema } from "@/core/infrastructure/validation/zod/schemas";
import { NumberInput } from "@/ui/components/number-input";
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
import { makeGetRewardDetail, makeEditReward } from "@/core/factories/reward";
import { EditActions } from "@/ui/components/edit-actions";

const MIN_POINTS_REQUIRED = 1;

export default function RewardEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pointsRequired: MIN_POINTS_REQUIRED,
  });

  const nameValidation = useRealtimeFieldValidation(
    editRewardSchema.shape.name,
    form.name
  );
  const descriptionValidation = useRealtimeFieldValidation(
    editRewardSchema.shape.description,
    form.description
  );
  const pointsRequiredValidation = useRealtimeFieldValidation(
    editRewardSchema.shape.pointsRequired,
    form.pointsRequired
  );

  useEffect(() => {
    const fetchReward = async () => {
      const fetchedReward = await makeGetRewardDetail().execute(
        parseInt(id as string, 10)
      );
      if (fetchedReward) {
        setForm({
          name: fetchedReward.name,
          description: fetchedReward.description,
          pointsRequired: fetchedReward.pointsRequired,
        });
      }
    };
    fetchReward();
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await makeEditReward().execute(parseInt(id as string, 10), form);
      Alert.alert("Dados atualizados com sucesso!");
      router.back();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        "Erro",
        `Não foi possível atualizar os dados da recompensa.\n\n${errorMessage}`
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
          title: "Editar Recompensa",
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
            Editar Recompensa
          </Text>

          {/* Nome */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Título:</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              placeholder="Digite o título da recompensa"
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

          {/* Pontos necessários */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Pontos necessários:</Text>
            <NumberInput
              minValue={MIN_POINTS_REQUIRED}
              initValue={form.pointsRequired}
              onValueChange={(value) => {
                setForm({ ...form, pointsRequired: value });
                pointsRequiredValidation.setTouched();
              }}
            />
            {pointsRequiredValidation.error && (
              <Text className="text-red-500 text-sm mt-1">
                {pointsRequiredValidation.error}
              </Text>
            )}
          </View>

          {/* Descrição */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-1">Descrição:</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              placeholder="Digite a descrição da recompensa"
              value={form.description}
              onChangeText={(value) => {
                setForm({ ...form, description: value });
                descriptionValidation.setTouched();
              }}
              multiline
            />
            {descriptionValidation.error && (
              <Text className="text-red-500 text-sm mt-1">
                {descriptionValidation.error}
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
