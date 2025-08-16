import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import {
  Controller,
  Control,
  RegisterOptions,
  FieldValues,
  Path,
} from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react-native";
import { clsx } from "clsx";
import { sc, vs, ms } from "../constants/responsive";
import useThemeStore from "@/stores/useThemeStore";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  secureTextEntry?: boolean;
  rules: RegisterOptions<T>;
};

export default function InputField<T extends FieldValues>({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  rules,
}: InputFieldProps<T>) {
  const [showPassword, setshowPassword] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const { theme } = useThemeStore();

  const handlePasswordIcon = () => setshowPassword((prev) => !prev);
  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);

  const passwordIconColor = theme === "light" ? "#374151" : "#E5E7EB";

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={shapes.inputBox}>
          <View
            style={[
              shapes.inputWrapper,
              isFocus && shapes.focusInput,
              error && shapes.errorInput,
            ]}
            className={clsx(
              "border-gray-300 dark:border-slate-400 bg-[#F8F9FA] dark:bg-[#2A2A2A]",
              error && "border-red-600 dark:border-red-500"
            )}
          >
            <TextInput
              key={theme}
              style={shapes.input}
              className="text-black dark:text-white"
              placeholder={placeholder}
              placeholderTextColor={theme === "light" ? "#6B7280" : "#9CA3AF"}
              secureTextEntry={secureTextEntry && !showPassword}
              onChangeText={onChange}
              onFocus={handleFocus}
              onBlur={() => {
                handleBlur();
                onBlur();
              }}
              value={value}
            />
            {secureTextEntry && (
              <TouchableOpacity
                onPress={handlePasswordIcon}
                style={shapes.iconContainer}
              >
                {showPassword ? (
                  <Eye size={sc(21)} color={passwordIconColor} />
                ) : (
                  <EyeClosed size={sc(21)} color={passwordIconColor} />
                )}
              </TouchableOpacity>
            )}
          </View>
          {error && (
            <Text
              style={shapes.errorMessage}
              className="text-red-600 dark:text-red-500 font-nata-sans-medium"
            >
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const shapes = StyleSheet.create({
  inputBox: {
    margin: ms(1),
  },
  inputWrapper: {
    alignItems: "center",
    flexDirection: "row",
    borderWidth: ms(1.5),
    borderRadius: ms(7),
    fontSize: sc(13),
    height: 52,
    paddingLeft: sc(5),
  },
  input: {
    flex: 1,
    flexWrap: "wrap-reverse",
    fontWeight: "500",
  },
  iconContainer: {
    paddingHorizontal: sc(12),
  },
  focusInput: {
    borderWidth: ms(2),
    borderRadius: ms(7),
  },
  errorInput: {
    borderWidth: ms(2),
    borderRadius: ms(7),
  },
  errorMessage: {
    fontSize: sc(10),
    marginTop: vs(2),
    alignItems: "flex-start",
  },
});
