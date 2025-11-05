import { Pressable, PressableProps } from "react-native";

interface AppButtonProps extends PressableProps {
  children: React.ReactNode;
  className?: string;
}

export function AppButton({ children, className, ...props }: AppButtonProps) {
  return (
    <Pressable
      className={`justify-center items-center ${className ?? ""}`}
      {...props}
    >
      {children}
    </Pressable>
  );
}
