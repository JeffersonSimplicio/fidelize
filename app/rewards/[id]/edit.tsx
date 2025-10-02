import { AppButton } from "@/ui/components/app-button";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
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
import { getRewardDetail } from "@/core/composition/rewards/get-reward-detail";
import { editRewardDetail } from "@/core/composition/rewards/edit-reward-detail";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { NumberInput } from "@/ui/components/number-input";

const MIN_POINTS_REQUIRED = 1;

export default function HomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [reward, setReward] = useState<Reward | null>(null);
  const [name, setName] = useState<string>("");
  const [pointsRequired, setPointsRequired] =
    useState<number>(MIN_POINTS_REQUIRED);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      const fetchedReward = await getRewardDetail.execute(
        parseInt(id as string, 10)
      );
      if (fetchedReward) {
        setReward(fetchedReward);
        setName(fetchedReward.name);
        setPointsRequired(fetchedReward.pointsRequired);
        setDescription(fetchedReward.description);
      }
    };

    fetchRewards();
  }, [id]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updateReward = { ...reward, name, description, pointsRequired };
      await editRewardDetail.execute(parseInt(id as string, 10), updateReward);
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
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text>Pontos necessários:</Text>
            <NumberInput
              minValue={MIN_POINTS_REQUIRED}
              initValue={pointsRequired}
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
