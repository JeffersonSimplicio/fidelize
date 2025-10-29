import React, { useEffect, useState } from "react";
import { View, TextInput, Alert } from "react-native";
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
    <View className="flex-row items-center justify-center space-x-4 mt-3 mb-3">
      <AppButton
        onPress={handleDecrement}
        className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center active:bg-gray-300"
      >
        <AntDesign name="minus" size={20} color="#333" />
      </AppButton>

      <TextInput
        className="border border-gray-300 rounded-lg text-center text-base text-gray-800 px-3 py-2 w-16 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 mx-2"
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={handleChange}
      />

      <AppButton
        onPress={handleIncrement}
        className="w-10 h-10 bg-gray-200 rounded-full justify-center items-center active:bg-gray-300"
      >
        <AntDesign name="plus" size={20} color="#333" />
      </AppButton>
    </View>
  );
}
