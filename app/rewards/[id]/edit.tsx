import { AppButton } from "@/ui/components/app-button";
import { rewardsDb } from "@/database_old/rewardsDb";
import { Reward } from "@/interfaces/reward";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [reward, setReward] = useState<Reward | null>(null);
  const [name, setName] = useState<string>("");
  const [pointsRequired, setPointsRequired] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const fetchRewards = async () => {
      const fetchedReward = await rewardsDb.getById(parseInt(id as string, 10));
      if (fetchedReward) {
        setReward(fetchedReward);
        setName(fetchedReward.name);
        setPointsRequired(fetchedReward.pointsRequired);
        setDescription(fetchedReward.description);
      }
    };

    fetchRewards();
  }, [id]);

  const increasePoints = () => setPointsRequired((prev) => prev + 1);
  const decreasePoints = () =>
    setPointsRequired((prev) => (prev > 0 ? prev - 1 : 0));

  const handlePointsChange = (text: string) => {
    const numericValue = parseInt(text, 10);
    if (isNaN(numericValue) || numericValue < 0) {
      setPointsRequired(0);
    } else {
      setPointsRequired(numericValue);
    }
  };

  const handleSave = async () => {
    if (!reward) return;
    const updatedReward = { name, description, pointsRequired };
    await rewardsDb.update(parseInt(id as string, 10), updatedReward);
    Alert.alert("Dados atualizados com sucesso!");
    router.back();
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
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <AppButton onPress={decreasePoints}>
              <AntDesign name="minus" size={24} color="black" />
            </AppButton>

            <TextInput
              keyboardType="numeric"
              value={pointsRequired.toString()}
              onChangeText={handlePointsChange}
            />
            <AppButton onPress={increasePoints}>
              <AntDesign name="plus" size={24} color="black" />
            </AppButton>
          </View>

          <View>
            <Text>Descrição:</Text>
            <TextInput
              placeholder="Digite a descrição da recompensa"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View>
            <AppButton onPress={handleSave}>
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
