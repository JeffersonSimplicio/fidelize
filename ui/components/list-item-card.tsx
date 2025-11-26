import { Link, LinkProps } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

type Props = {
  href: LinkProps['href'];
  title: string;
  subtitle?: string;
  extra?: string;
  variant?: 'filled' | 'outlined';
};

export function ListItemCard({
  href,
  title,
  subtitle,
  extra,
  variant = 'filled',
}: Props) {
  const base = 'p-3 mb-2 rounded-lg active:bg-gray-200';

  const variants = {
    filled: 'bg-gray-100',
    outlined: 'bg-white border border-gray-200 active:bg-gray-100',
  };

  return (
    <Link href={href} asChild>
      <TouchableOpacity className={`${base} ${variants[variant]}`}>
        <Text className="text-base font-semibold text-gray-800">{title}</Text>

        {subtitle && <Text className="text-gray-600">{subtitle}</Text>}

        {extra && <Text className="text-sm text-gray-500">{extra}</Text>}
      </TouchableOpacity>
    </Link>
  );
}
