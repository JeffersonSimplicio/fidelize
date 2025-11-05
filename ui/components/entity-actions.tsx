import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";
import { DeleteButton } from "@/ui/components/delete-button";

interface EntityActionsProps {
  onDelete: () => void;
  onEdit: () => void;
}

export function EntityActions({ onDelete, onEdit }: EntityActionsProps) {
  return (
    <>
      <View className="absolute bottom-6 left-6">
        <DeleteButton onDelete={onDelete} />
      </View>

      <View className="absolute bottom-6 right-6">
        <AppButton
          onPress={onEdit}
          className="w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-md active:opacity-70"
        >
          <FontAwesome name="edit" size={22} color="white" />
        </AppButton>
      </View>
    </>
  );
}
