import React, { useEffect, useState } from "react";
import { View, TextInput, Alert, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { AppButton } from "@/ui/components/app-button";

interface NumberInputProps {
  minValue: number;
  initValue?: number;
  warningMessage?: string;
  onValueChange?: (value: number) => void;
}

export function NumberInput({
  minValue,
  initValue = minValue,
  warningMessage,
  onValueChange,
}: NumberInputProps) {
  const [value, setValue] = useState<number>(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  function showWarning() {
    Alert.alert(
      "Aviso",
      warningMessage || `O valor mínimo permitido é ${minValue}.`
    );
  }

  function updateValue(newValue: number) {
    setValue(newValue);
    onValueChange?.(newValue);
  }

  function handleIncrement() {
    updateValue(value + 1);
  }

  function handleDecrement() {
    if (value - 1 < minValue) {
      showWarning();
    } else {
      updateValue(value - 1);
    }
  }

  function handleChange(text: string) {
    const number = parseInt(text, 10);
    if (isNaN(number) || number < minValue) {
      showWarning();
      updateValue(minValue);
    } else {
      updateValue(number);
    }
  }

  return (
    <View style={styles.container}>
      <AppButton onPress={handleDecrement}>
        <AntDesign name="minus" size={24} color="black" />
      </AppButton>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value.toString()}
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
