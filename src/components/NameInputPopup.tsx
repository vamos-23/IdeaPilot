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
import { sc, vs } from "../constants/responsive";
import { updateDisplayName } from "../lib/auth/updateDisplayName";
import useThemeStore from "../store/useThemeStore";
import SubmitButton from "./SubmitButton";

type NameInputProps = {
  onClose: () => void;
  showNamePopup: (state: boolean) => void;
  showEditPopup: (state: boolean) => void;
};
export default function NameInputPopup({
  onClose,
  showNamePopup,
  showEditPopup,
}: NameInputProps) {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        "Display Name Status",
        "Your display name has been updated successfully!"
      );
      setName("");
      Keyboard.dismiss();
      showNamePopup(false);
      showEditPopup(false);
    } catch (error: any) {
      console.log(error.message);
      Alert.alert("Error!", "Display name could not be updated");
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
                  cursorColor={theme === "light" ? "black" : "tomato"}
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
                onSubmit={updateName}
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
