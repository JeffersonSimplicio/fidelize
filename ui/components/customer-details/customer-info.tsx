import { CustomerDto } from "@/core/application/dtos";
import { formatDate } from "@/ui/utils/format-date";
import { View, Text } from "react-native";

function formatPhone(phone: string): string {
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

export function CustomerInfo({ customer }: { customer: CustomerDto }) {
  return (
    <View>
      <Text>Cliente</Text>
      <Text>Name: {customer.name}</Text>
      <Text>Telefone: {formatPhone(customer.phone)}</Text>
      <Text>Pontos acumulados: {customer.points}</Text>
      <Text>
        Ultima visita: {formatDate(customer.lastVisitAt)}
      </Text>
      <Text>
        Criado em: {formatDate(customer.createdAt)}
      </Text>
    </View>
  );
}
