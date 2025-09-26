import { Pressable, PressableProps, StyleSheet } from "react-native";

interface AppButtonProps extends PressableProps {
  children: React.ReactNode;
}

export function AppButton({ children, style, ...props }: AppButtonProps) {
  return (
    <Pressable
      style={(state) => [
        styles.default,
        style instanceof Function ? style(state) : style,
        state.pressed && { opacity: 0.6 },
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    justifyContent: "center",
    alignItems: "center",
  },
});
