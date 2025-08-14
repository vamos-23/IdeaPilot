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
import { sc, vs, ms } from "../constants/responsive";

/*type FieldValues = Record<string,any>
FieldValues is required for Control<T> and Path<T> for ensuring correct form data handling with base constraint as : form data should be of the form key:value */
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
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const handlePasswordIcon = () => setshowPassword((prev) => !prev);
  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);
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
              shapes.shadow,
              isFocus && shapes.focusInput,
              error && shapes.errorInput,
            ]}
          >
            <TextInput
              style={shapes.input}
              placeholder={placeholder}
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
                  <Eye size={sc(20)} color="#1e293b" />
                ) : (
                  <EyeClosed size={sc(20)} color="#1e293b" />
                )}
              </TouchableOpacity>
            )}
          </View>
          {error && (
            <Text style={shapes.errorMessage} className="text-red-600">
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
    borderColor: "#e2e8f0",
  },
  shadow: {
    backgroundColor: "#fff",
    elevation: 2,
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
    borderColor: "#708090",
    borderWidth: ms(2.5),
    borderRadius: ms(7),
  },
  errorInput: {
    borderColor: "red",
    borderWidth: ms(2.5),
    borderRadius: ms(7),
  },
  errorMessage: {
    fontSize: sc(10),
    marginTop: vs(2),
    alignItems: "flex-start",
  },
});
