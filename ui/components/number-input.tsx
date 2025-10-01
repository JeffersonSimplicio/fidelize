import React from "react";
import { View, TextInput, Alert, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";
import { useCounter } from "@/ui/hooks/use-counter";

interface NumberInputProps {
  minValue: number;
  warningMessage?: string;
  onValueChange?: (value: number) => void;
}

export function NumberInput(props: NumberInputProps) {
  const { minValue, warningMessage, onValueChange } = props;

  const { count, increment, decrement, setValue } = useCounter(minValue);

  function updateValue(newValue: number) {
    setValue(newValue);
    onValueChange?.(newValue);
  }

  function handleIncrement() {
    increment();
  }

  function handleDecrement() {
    if (count - 1 < minValue) {
      showWarning();
    } else {
      decrement();
    }
  }

  function handleChange(text: string) {
    const number = parseInt(text, 10);

    if (isNaN(number)) {
      updateValue(minValue);
      return;
    }

    if (number < minValue) {
      showWarning();
      updateValue(minValue);
    } else {
      updateValue(number);
    }
  }

  function showWarning() {
    Alert.alert(
      "Aviso",
      warningMessage || `O valor mínimo permitido é ${minValue}.`
    );
  }

  return (
    <View style={styles.container}>
      <AppButton onPress={handleDecrement}>
        <AntDesign name="minus" size={24} color="black" />
      </AppButton>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={count.toString()}
        onChangeText={handleChange}
      />
      <AppButton onPress={handleIncrement}>
        <AntDesign name="plus" size={24} color="black" />
      </AppButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    width: 60,
    textAlign: "center",
    borderRadius: 5,
  },
});
