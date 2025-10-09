import { Customer } from "@/core/domain/customers/customer.entity";
import { View, Text } from "react-native";

function formatPhone(phone: string): string {
  return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}

export function CustomerInfo({ customer }: { customer: Customer }) {
  return (
    <View>
      <Text>Cliente</Text>
      <Text>Name: {customer.name}</Text>
      <Text>Telefone: {formatPhone(customer.phone)}</Text>
      <Text>Pontos acumulados: {customer.points}</Text>
      <Text>
        Ultima visita: {customer.lastVisitAt.toLocaleDateString("pt-BR")}
      </Text>
      <Text>
        Criado em: {customer.createdAt.toLocaleDateString("pt-BR")}
      </Text>
    </View>
  );
}
