import { View } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { AppButton } from './app-button';

interface EditActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function EditActions({ isLoading, onSave, onCancel }: EditActionsProps) {
  return (
    <View className="mt-4 flex-row items-center justify-between px-4">
      <AppButton
        disabled={isLoading}
        onPress={onSave}
        className="h-12 w-12 items-center justify-center rounded-full bg-green-500 active:bg-green-600"
      >
        <FontAwesome name="save" size={24} color="white" />
      </AppButton>

      <AppButton
        onPress={onCancel}
        className="h-12 w-12 items-center justify-center rounded-full bg-red-500 active:bg-red-600"
      >
        <MaterialIcons name="cancel" size={24} color="white" />
      </AppButton>
    </View>
  );
}
