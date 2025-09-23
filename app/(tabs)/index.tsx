import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Tab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button title="Go to Details" onPress={() => router.push('./details/7')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
