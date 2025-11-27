import { Alert, GestureResponderEvent } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { AppButton } from '@/ui/components/app-button';

type Props = {
  onDelete: () => Promise<void> | void;
  confirm?: boolean;
};

export function DeleteButton({ onDelete, confirm = true }: Props) {
  const handlePress = async (_e: GestureResponderEvent) => {
    if (confirm) {
      Alert.alert(
        'Confirmar exclusão',
        'Tem certeza que quer deletar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Deletar',
            style: 'destructive',
            onPress: async () => {
              try {
                await onDelete();
              } catch (err) {
                console.error(err);
              }
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      try {
        await onDelete();
      } catch (err) {
        Alert.alert(
          'Erro',
          'Não foi possível deletar. Tente novamente mais tarde.',
        );
        console.error(err);
      }
    }
  };

  return (
    <AppButton
      onPress={handlePress}
      className="h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-md active:opacity-70"
    >
      <FontAwesome name="trash" size={22} color="white" />
    </AppButton>
  );
}
