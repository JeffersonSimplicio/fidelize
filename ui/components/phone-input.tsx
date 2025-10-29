import { useEffect, useState } from "react";
import { View, TextInput } from "react-native";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(formatPhone(value));

  function formatPhone(phone: string) {
    const cleaned = phone.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  }

  function handleChange(text: string) {
    const numericValue = text.replace(/\D/g, "").slice(0, 11);
    setDisplayValue(formatPhone(numericValue));
    onChange(numericValue);
  }

  useEffect(() => {
    setDisplayValue(formatPhone(value));
  }, [value]);

  return (
    <View className="w-full my-2">
      <TextInput
        className="border border-gray-300 rounded-lg p-3 text-base text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
        value={displayValue}
        onChangeText={handleChange}
        placeholder={placeholder || "(00) 00000-0000"}
        keyboardType="numeric"
        maxLength={15}
        cursorColor="#007AFF"
      />
    </View>
  );
}
