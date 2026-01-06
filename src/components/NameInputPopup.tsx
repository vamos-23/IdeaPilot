import { clsx } from "clsx";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { sc, vs } from "../constants/responsive";
import { updateDisplayName } from "../lib/auth/updateDisplayName";
import useThemeStore from "../store/useThemeStore";
import useAuthStore from "../store/useAuthStore";
import SubmitButton from "./SubmitButton";

type NameInputProps = {
  onClose: () => void;
  action: () => void;
};
export default function NameInputPopup({ onClose, action }: NameInputProps) {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [name, setName] = useState<string>("");
  const [isFocus, setFocus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const updateName = async (newName: string) => {
    const normalizedNewName = newName.trim();
    const currentName = user?.userName?.trim();

    if (!normalizedNewName) {
      Toast.show({
        type: "error",
        text1: "Invalid name",
        text2: "Display name cannot be empty.",
        topOffset: sc(45),
      });
      return;
    }

    if (
      currentName &&
      normalizedNewName.toLowerCase() === currentName.toLowerCase()
    ) {
      Toast.show({
        type: "info",
        text1: "No changes detected",
        text2: "This is already your current display name.",
        topOffset: sc(45),
      });
      setName("");
      Keyboard.dismiss();
      return;
    }

    try {
      setLoading(true);
      await updateDisplayName(normalizedNewName);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Toast.show({
        type: "success",
        text1: "Display name updated",
        text2: "Your display name was updated successfully.",
        topOffset: sc(45),
      });

      setName("");
      Keyboard.dismiss();
      action();
    } catch (error: any) {
      console.error(error.message);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "Please try again.",
        topOffset: sc(45),
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          contentContainerStyle={styles.overView}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "android" ? 60 : 120}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={styles.popup}
              className="bg-[#F5F5F5] dark:bg-[#03154c] border-blue-500 dark:border-gray-500"
            >
              <View className="flex-row justify-between">
                <Text
                  className="text-black dark:text-white font-nata-sans-bold"
                  style={styles.title}
                >
                  Update Name
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <X
                    stroke={theme === "dark" ? "#ffffff" : "#000000"}
                    size={sc(20)}
                    strokeWidth={sc(3)}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={styles.input}
                className={clsx(
                  "bg-slate-300 dark:bg-[#293253] mb-5",
                  isFocus
                    ? "border-blue-600 dark:border-blue-500"
                    : "border-[#307ae8b5] dark:border-blue-800"
                )}
              >
                <TextInput
                  className="text-black dark:text-textDark font-semibold"
                  cursorColor={theme === "light" ? "green" : "tomato"}
                  placeholder="Enter new display name"
                  placeholderTextColor={
                    theme === "light" ? "dimgrey" : "silver"
                  }
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
                onSubmit={() => updateName(name)}
                loadingText="Updating name..."
              />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  overView: {
    flex: 1,
  },
  popup: {
    width: sc(285),
    padding: sc(20),
    borderRadius: sc(12),
    borderWidth: sc(1.7),
  },
  input: {
    width: "100%",
    height: vs(38),
    borderRadius: sc(7),
    borderWidth: sc(2),
    paddingHorizontal: sc(5),
  },
  title: {
    fontSize: sc(18),
    textAlign: "center",
    marginBottom: sc(16),
  },
});
