import { registerReward } from "@/core/composition/rewards/commands/register-reward";
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
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
      const newReward = await registerReward.execute({
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
      <Stack.Screen
        options={{
          title: "Cadastrar Recompensa",
        }}
      />
      <View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View>
            <Text>Cadastro Nova Recompensa</Text>
          </View>
          <View>
            <Text>Título:</Text>
            <TextInput
              placeholder="Digite o título da recompensa"
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
            <Text>Pontos necessários:</Text>
            <NumberInput
              minValue={MIN_POINTS_REQUIRED}
              onValueChange={(value) => {
                setForm({ ...form, pointsRequired: value });
                pointsRequiredValidation.setTouched();
              }}
            />
            {pointsRequiredValidation.error && (
              <Text style={{ color: "red" }}>
                {pointsRequiredValidation.error}
              </Text>
            )}
          </View>
          <View>
            <Text>Descrição:</Text>
            <TextInput
              placeholder="Digite a descrição da recompensa"
              value={form.description}
              onChangeText={(value) => {
                setForm({ ...form, description: value });
                descriptionValidation.setTouched();
              }}
            />
            {descriptionValidation.error && (
              <Text style={{ color: "red" }}>
                {descriptionValidation.error}
              </Text>
            )}
          </View>
          <AppButton
            onPress={handleAddReward}
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
    backgroundColor: "#007AFF",
  },
  disabled: {
    backgroundColor: "#ccc",
  },
});
