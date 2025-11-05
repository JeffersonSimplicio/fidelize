import { View } from "react-native";
import { AppButton } from "./app-button";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface EditActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function EditActions({ isLoading, onSave, onCancel }: EditActionsProps) {
  return (
    <View className="flex-row justify-between items-center mt-4 px-4">
      <AppButton
        disabled={isLoading}
        onPress={onSave}
        className="w-12 h-12 bg-green-500 rounded-full justify-center items-center active:bg-green-600"
      >
        <FontAwesome name="save" size={24} color="white" />
      </AppButton>

      <AppButton
        onPress={onCancel}
        className="w-12 h-12 bg-red-500 rounded-full justify-center items-center active:bg-red-600"
      >
        <MaterialIcons name="cancel" size={24} color="white" />
      </AppButton>
    </View>
  );
}
