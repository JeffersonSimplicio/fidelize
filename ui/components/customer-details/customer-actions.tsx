import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";
import { DeleteButton } from "@/ui/components/delete-button";

interface Props {
  onDelete: () => void;
  onEdit: () => void;
}

export function CustomerActions({ onDelete, onEdit }: Props) {
  return (
    <View>
      <DeleteButton onDelete={onDelete} size={30} />
      <AppButton onPress={onEdit}>
        <FontAwesome name="edit" size={30} color="black" />
      </AppButton>
    </View>
  );
}
