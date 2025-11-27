import { View, Text } from 'react-native';

import { CustomerDto } from '@/core/application/dtos';
import { formatDate } from '@/ui/utils/format-date';

function formatPhone(phone: string): string {
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}

export function CustomerInfo({ customer }: { customer: CustomerDto }) {
  return (
    <View className="mb-4 rounded-xl bg-gray-50 p-4 shadow-sm">
      <Text className="mb-2 text-lg font-semibold text-gray-800">Cliente</Text>

      <Text className="text-gray-700">
        <Text className="font-semibold">Nome:</Text> {customer.name}
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">Telefone:</Text>{' '}
        {formatPhone(customer.phone)}
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">Pontos acumulados:</Text>{' '}
        {customer.points}
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">Última visita:</Text>{' '}
        {formatDate(customer.lastVisitAt)}
      </Text>
      <Text className="text-gray-700">
        <Text className="font-semibold">Criado em:</Text>{' '}
        {formatDate(customer.createdAt)}
      </Text>
    </View>
  );
}
