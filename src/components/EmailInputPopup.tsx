import { clsx } from "clsx";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { sc, vs } from "../constants/responsive";
import { updateDisplayName } from "../lib/auth/updateDisplayName";
import useThemeStore from "../store/useThemeStore";
import SubmitButton from "./SubmitButton";

export default function EmailInputPopup() {
  const { theme } = useThemeStore();
  const [name, setName] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);
  const updateName = async () => {
    setLoading(true);
    try {
      await updateDisplayName(name);
      await new Promise((resolve) => setTimeout(resolve, 2600));
      Alert.alert(
        "Display Name Status",
        "Your display name has been updated successfully!"
      );
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Error", "Display name could not be updated");
    }
  };
  return (
    <View>
      <View>
        <Text>Update your display name</Text>
        <View
          style={styles.input}
          className={clsx(
            "bg-slate-300 dark:bg-[#293253] mb-5",
            isFocus
              ? "border-blue-600 dark:border-blue-600"
              : "border-[#307ae8b5] dark:border-blue-800"
          )}
        >
          <TextInput
            className="text-black dark:text-textDark font-semibold justify-center"
            cursorColor={theme === "light" ? "black" : "tomato"}
            placeholder="Enter new display name"
            placeholderTextColor={theme === "light" ? "dimgrey" : "silver"}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={name}
            onChangeText={setName}
          />
        </View>
        <SubmitButton
          buttonText="Update Display Name"
          isLoading={isLoading}
          isDisabled={false}
          onSubmit={updateName}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    width: "75%",
    height: vs(36),
    borderRadius: sc(7),
    borderWidth: sc(2),
    paddingHorizontal: sc(4),
  },
});
