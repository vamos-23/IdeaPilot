import { sc } from "@/src/constants/responsive";
import { X } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import SubmitButton from "./SubmitButton";

type EditProfileProps = {
  onClose: () => void;
  onEditName: () => void;
  onEditEmail: () => void;
};

export default function EditProfilePopup({
  onClose,
  onEditName,
  onEditEmail,
}: EditProfileProps) {
  const { theme } = useThemeStore();
  return (
    <View style={styles.overlay}>
      <View
        style={styles.popup}
        className="bg-[#F5F5F5] dark:bg-[#03154c] border-blue-500
       dark:border-gray-500"
      >
        <View className="flex-row justify-between">
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.title}
          >
            Edit Profile
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X
              stroke={theme === "dark" ? "#ffffff" : "#000000"}
              size={sc(20)}
              strokeWidth={sc(3)}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonGroup}>
          <SubmitButton
            buttonText="Update Display Name"
            isDisabled={false}
            onSubmit={onEditName}
          />
          <SubmitButton
            buttonText="Update Email"
            isDisabled={false}
            onSubmit={onEditEmail}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -11,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popup: {
    width: sc(295),
    padding: sc(20),
    borderRadius: sc(12),
    borderWidth: sc(1.7),
  },
  title: {
    fontSize: sc(18),
    textAlign: "center",
    marginBottom: sc(16),
  },
  buttonGroup: {
    gap: sc(11),
  },
});
