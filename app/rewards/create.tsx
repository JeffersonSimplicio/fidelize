import { rewardsDb } from "@/database/rewardsDb";
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

export default function NewRewardScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddReward() {
    if (
      title.trim() === "" ||
      pointsRequired.trim() === "" ||
      description.trim() === ""
    ) {
      Alert.alert("Atenção", "Preencha todos os campos");
      return;
    }
    try {
      setLoading(true);
      const newReward = await rewardsDb.add({
        name: title,
        pointsRequired: Number(pointsRequired),
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
        `Não foi possível cadastrar a recompensa.\n ${errorMessage}`
      );
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
            <Text>Cadastro Novo Cliente</Text>
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
            <TextInput
              placeholder="Digite os pontos necessários"
              keyboardType="numeric"
              value={pointsRequired}
              onChangeText={setPointsRequired}
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
