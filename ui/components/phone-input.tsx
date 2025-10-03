import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={displayValue}
        onChangeText={handleChange}
        placeholder={placeholder || "(00) 00000-0000"}
        keyboardType="numeric"
        maxLength={15}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
