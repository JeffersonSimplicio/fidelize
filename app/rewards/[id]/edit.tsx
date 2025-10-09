import { editRewardDetail } from "@/core/composition/rewards/commands/edit-reward-detail";
import { getRewardDetail } from "@/core/composition/rewards/queries/get-reward-detail";
import { editRewardSchema } from "@/core/infrastructure/validation/zod/schemas";
import { AppButton } from "@/ui/components/app-button";
import { NumberInput } from "@/ui/components/number-input";
import { useRealtimeFieldValidation } from "@/ui/hooks/use-realtime-form-validation";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";

const MIN_POINTS_REQUIRED = 1;

export default function HomeScreen() {
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
    const fetchRewards = async () => {
      const fetchedReward = await getRewardDetail.execute(
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

    fetchRewards();
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await editRewardDetail.execute(parseInt(id as string, 10), {
        name: form.name,
        description: form.description,
        pointsRequired: form.pointsRequired,
      });
      Alert.alert("Dados atualizados com sucesso!");
      router.back();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        "Erro",
        `Não foi possível atualizar os dados da recompensa.\n\n ${errorMessage}`
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
              initValue={form.pointsRequired}
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
