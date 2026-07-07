import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useForm, RegisterOptions, Path, FieldValues } from "react-hook-form";
import { useCallback, useState } from "react";
import { sc, vs, ms } from "@/src/constants/responsive";
import performPasswordReset from "../lib/account/performPasswordReset";
import InputField from "@/src/components/InputField";
import SubmitButton from "@/src/components/SubmitButton";

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
  asyncButtonText: string;
  isButtonLoading: boolean;
  onSubmit: (data: T) => Promise<void>;
  userFormPromptText?: string;
  forgotPassWord?: string;
  formActionText?: string;
};

export default function FormLayout<T extends FieldValues>({
  title,
  description,
  fields,
  buttonText,
  isButtonLoading,
  asyncButtonText,
  userFormPromptText,
  forgotPassWord,
  formActionText,
  onSubmit,
}: AuthFormProps<T>) {
  const { control, handleSubmit } = useForm<T>();
  const [isResetPasswordView, setIsResetPasswordView] =
    useState<boolean>(false);

  const handlePasswordReset = useCallback(
    (status: boolean) => setIsResetPasswordView(status),
    [],
  );

  const handleSendPasswordResetEmail = async (email: string) => {
    await performPasswordReset(email, () => setIsResetPasswordView(false));
  };

  const onReset = (data: T) => {
    handleSendPasswordResetEmail(data.email);
  };

  return (
    <View>
      <View>
        <Text
          style={shapes.title}
          className="text-textLight dark:text-white font-nata-sans-bold"
        >
          {isResetPasswordView ? "Reset Password" : title}
        </Text>
        <Text
          style={shapes.description}
          className="text-slate-500 dark:text-textDark font-nata-sans-medium mt-1"
        >
          {isResetPasswordView
            ? "Enter your email address and we'll send you a reset link."
            : description}
        </Text>
      </View>

      <View style={shapes.fieldSpace}>
        {isResetPasswordView ? (
          <InputField<T>
            control={control}
            name={"email" as Path<T>}
            placeholder="Enter your email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            }}
          />
        ) : (
          fields.map((value) => (
            <InputField<T>
              key={value.name as string}
              control={control}
              name={value.name as Path<T>}
              secureTextEntry={value.secureTextEntry}
              placeholder={value.placeholder}
              rules={value.rules}
            />
          ))
        )}
      </View>

      <SubmitButton
        buttonText={isResetPasswordView ? "Send Reset Link" : buttonText}
        loadingText={asyncButtonText}
        isLoading={isButtonLoading}
        isDisabled={false}
        onSubmit={
          isResetPasswordView ? handleSubmit(onReset) : handleSubmit(onSubmit)
        }
      />

      {!isResetPasswordView && forgotPassWord && (
        <TouchableOpacity onPress={() => handlePasswordReset(true)}>
          <Text className="text-accent-light dark:text-accent-dark2 font-nata-sans-medium text-center mt-6">
            {forgotPassWord}
          </Text>
        </TouchableOpacity>
      )}

      {isResetPasswordView && (
        <TouchableOpacity onPress={() => handlePasswordReset(false)}>
          <Text className="text-accent-light dark:text-accent-dark2 font-nata-sans-medium text-center mt-6">
            Back to Sign In
          </Text>
        </TouchableOpacity>
      )}

      {!isResetPasswordView && (
        <View className={forgotPassWord ? "mt-4" : "mt-6"}>
          <Text className="text-textLight dark:text-textDark font-nata-sans-medium text-center">
            {userFormPromptText + " "}
            <Link
              href={
                formActionText === "Sign Up"
                  ? "/(auth)/signUp"
                  : "/(auth)/signIn"
              }
            >
              <Text className="text-lg text-accent-light dark:text-accent-dark2 font-nata-sans-bold">
                {formActionText}
              </Text>
            </Link>
          </Text>
        </View>
      )}
    </View>
  );
}

const shapes = StyleSheet.create({
  title: {
    fontSize: ms(24),
  },
  description: {
    fontSize: sc(13),
    lineHeight: vs(20),
  },
  fieldSpace: {
    gap: vs(16),
    marginTop: vs(24),
    marginBottom: vs(24),
  },
});
