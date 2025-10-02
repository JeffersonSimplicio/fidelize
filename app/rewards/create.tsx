import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Button,
  Alert,
} from "react-native";
import { registerReward } from "@/core/composition/rewards/register-reward";
import { NumberInput } from "@/ui/components/number-input";

const MIN_POINTS_REQUIRED = 1;

export default function NewRewardScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [pointsRequired, setPointsRequired] = useState(MIN_POINTS_REQUIRED);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddReward() {
    if (title.trim() === "" || description.trim() === "") {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      const newReward = await registerReward.execute({
        name: title,
        pointsRequired: pointsRequired,
        description: description,
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
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View>
            <Text>Pontos necessários:</Text>
            <NumberInput
              minValue={MIN_POINTS_REQUIRED}
              onValueChange={setPointsRequired}
            />
          </View>
          <View>
            <Text>Descrição:</Text>
            <TextInput
              placeholder="Digite a descrição da recompensa"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <Button
            onPress={handleAddReward}
            disabled={loading}
            title={loading ? "Cadastrando..." : "Cadastrar"}
          />
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
