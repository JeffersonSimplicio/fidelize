import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { makeRegisterCustomer } from '@/core/factories/customer';
import { registerCustomerSchema } from '@/core/infrastructure/validation/zod/schemas';
import { AppButton } from '@/ui/components/app-button';
import { PhoneInput } from '@/ui/components/phone-input';
import { useRealtimeFieldValidation } from '@/ui/hooks/use-realtime-form-validation';

export default function NewCustomerScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const nameValidation = useRealtimeFieldValidation(
    registerCustomerSchema.shape.name,
    form.name,
  );
  const phoneValidation = useRealtimeFieldValidation(
    registerCustomerSchema.shape.phone,
    form.phone,
    1000,
  );

  const isFormInvalid =
    !!nameValidation.error ||
    !!phoneValidation.error ||
    form.name.trim() === '' ||
    form.phone.trim() === '';

  async function handleAddCustomer() {
    try {
      setLoading(true);
      const newCustomer = await makeRegisterCustomer().execute(form);
      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace(`/customers/${newCustomer.id}`),
        },
      ]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      Alert.alert(
        'Erro',
        `Não foi possível cadastrar o cliente.\n\n${errorMessage}`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Cadastrar Cliente' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-white"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800">
              Cadastro Novo Cliente
            </Text>
          </View>

          {/* Campo Nome */}
          <View className="mb-4">
            <Text className="mb-1 font-medium text-gray-700">Nome</Text>
            <TextInput
              className="rounded-lg border border-gray-300 p-3 text-base"
              placeholder="Digite o nome do cliente"
              value={form.name}
              onChangeText={(value) => {
                setForm({ ...form, name: value });
                nameValidation.setTouched();
              }}
            />
            {nameValidation.error && (
              <Text className="mt-1 text-sm text-red-500">
                {nameValidation.error}
              </Text>
            )}
          </View>

          {/* Campo Telefone */}
          <View className="mb-6">
            <Text className="mb-1 font-medium text-gray-700">Telefone</Text>
            <PhoneInput
              value={form.phone}
              onChange={(value) => {
                setForm({ ...form, phone: value });
                phoneValidation.setTouched();
              }}
            />
            {phoneValidation.error && (
              <Text className="mt-1 text-sm text-red-500">
                {phoneValidation.error}
              </Text>
            )}
          </View>

          {/* Botão */}
          <AppButton
            onPress={handleAddCustomer}
            disabled={loading || isFormInvalid}
            className={`rounded-lg p-4 ${
              loading || isFormInvalid
                ? 'bg-gray-400'
                : 'bg-blue-600 active:opacity-80'
            }`}
          >
            <Text className="text-base font-bold text-white">
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </AppButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
