import { TopRewardDto } from "@/core/application/dtos/customer-rewards";
import { Link } from "expo-router";
import { FlatList, View, Text, TouchableOpacity } from "react-native";

type Props = {
  topRewards: TopRewardDto[];
};

export function TopRewardsByRedeem({ topRewards }: Props) {
  return (
    <View className="bg-gray-50 rounded-xl p-4 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-3">
        🎉 Top 3 recompensas mais resgatadas
      </Text>

      <FlatList
        data={topRewards}
        keyExtractor={(item) => item.reward.id!.toString()}
        renderItem={({ item }) => (
          <Link href={`/rewards/${item.reward.id}`} asChild>
            <TouchableOpacity className="p-3 mb-2 bg-white rounded-lg border border-gray-200 active:bg-gray-100">
              <Text className="text-gray-800 font-medium">
                {item.reward.name}
              </Text>
              <Text className="text-gray-600">
                {item.reward.pointsRequired} pontos necessários
              </Text>
              <Text className="text-gray-500 text-sm">
                {item.redeemedCount}{" "}
                {item.redeemedCount === 1 ? "resgate" : "resgates"}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-3">
            <Text className="text-gray-500">
              Nenhuma recompensa cadastrada.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
