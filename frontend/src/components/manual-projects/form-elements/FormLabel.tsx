import { Text } from "react-native";

type FormLabelProps = {
  label: string;
};

export default function FormLabel({ label }: FormLabelProps) {
  return (
    <Text className="text-md font-nata-sans-bold tracking-wider text-textLight dark:text-white">
      {label}
    </Text>
  );
}
