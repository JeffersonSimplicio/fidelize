import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { AppButton } from '@/ui/components/app-button';
import { DeleteButton } from '@/ui/components/delete-button';

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
          className="h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-md active:opacity-70"
        >
          <FontAwesome name="edit" size={22} color="white" />
        </AppButton>
      </View>
    </>
  );
}
