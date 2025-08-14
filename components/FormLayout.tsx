import { View, Text, StyleSheet,TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import {
  useForm,
  RegisterOptions,
  //SubmitHandler,
  Path,
  FieldValues,
} from "react-hook-form";
import { sc, vs, ms } from "@/constants/responsive";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

type Fields<T extends FieldValues> = {
  name: Path<T>;
  placeholder: string;
  secureTextEntry?: boolean;
  rules: RegisterOptions<T>;
};

type AuthFormProps<T extends FieldValues> = {
  title: string;
  description: string;
  fields: Fields<T>[];
  buttonText: string;
  onSubmit: () => void;
  userFormPromptText: string;
  forgotPassWord?: string;
  formActionText: string;
};

export default function FormLayout<T extends FieldValues>({
  title,
  description,
  fields,
  buttonText,
  userFormPromptText,
  forgotPassWord,
  formActionText,
  onSubmit,
}: AuthFormProps<T>) {
  const { control, handleSubmit } = useForm<T>();
  return (
    <View>
      <View>
        <Text style={shapes.title} className="font-bold">{title}</Text>
        <Text style={shapes.description} className="text-formTextLight font-semibold">
          {description}
        </Text>
      </View>
      <View style={shapes.fieldSpace}>
        {fields.map((value) => (
          <InputField<T>
            key={value.name as string}
            control={control}
            name={value.name}
            secureTextEntry={value.secureTextEntry}
            placeholder={value.placeholder}
            rules={value.rules}
          />
        ))}
      </View>
      <SubmitButton buttonText={buttonText} onSubmit={handleSubmit(onSubmit)} />
      {forgotPassWord && (
        <TouchableOpacity activeOpacity={5}>
        <Link className="mt-6" href="/(auth)">
          <Text className="text-blue-900 text-center">{forgotPassWord}</Text>
        </Link>
        </TouchableOpacity>
      )}
      <Link className={forgotPassWord ? "mt-4" : "mt-6"} href="/(auth)/sign-in">
        <Text className="text-formTextLight font-medium text-center">
          {userFormPromptText + " "}
          <Text className="text-lg underline font-semibold text-blue-900">
            {formActionText}
          </Text>
        </Text>
      </Link>
    </View>
  );
}

const shapes = StyleSheet.create({
  title: {
    fontSize: ms(25),
    marginBottom: vs(3),
  },
  description: {
    fontSize: sc(11),
  },
  fieldSpace: {
    gap: vs(19),
    marginTop: vs(20),
    marginBottom: vs(22),
  },
});
