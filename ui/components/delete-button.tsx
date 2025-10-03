import { Alert, GestureResponderEvent } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";

type Props = {
  onDelete: () => Promise<void> | void;
  confirm?: boolean;
  size?: number;
  color?: string;
};

export function DeleteButton({
  onDelete,
  confirm = true,
  size = 30,
  color = "black",
}: Props) {
  const handlePress = async (e: GestureResponderEvent) => {
    if (confirm) {
      Alert.alert(
        "Confirmar exclusão",
        "Tem certeza que quer deletar?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Deletar",
            style: "destructive",
            onPress: async () => {
              try {
                await onDelete();
              } catch (err) {
                console.error(err);
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      try {
        await onDelete();
      } catch (err) {
        Alert.alert(
          "Erro",
          "Não foi possível deletar. Tente novamente mais tarde."
        );
        console.error(err);
      }
    }
  };

  return (
    <AppButton
      onPress={handlePress}
      accessibilityLabel="Botão deletar"
      accessibilityRole="button"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <FontAwesome name="trash" size={size} color={color} />
    </AppButton>
  );
}
