import { sc } from "@/src/constants/responsive";
import { X } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SubmitButton from "./SubmitButton";

type EditProfileProps = {
  onClose: () => void;
  onEditName: () => void;
  onEditEmail: () => void;
  appTheme: string;
};

export default function EditProfilePopup({
  onClose,
  onEditName,
  onEditEmail,
  appTheme
}: EditProfileProps) {


  return (
    <View style={styles.overlay}>
      <View
        style={styles.popup}
        className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark shadow-xl"
      >
        <View className="flex-row justify-between items-center mb-5">
          <Text
            className="text-textLight dark:text-white font-nata-sans-bold"
            style={styles.title}
          >
            Edit Profile
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-brandLight dark:bg-brandDark p-1.5 rounded-full"
          >
            <X
              stroke={appTheme === "dark" ? "#F8FAFC" : "#0F172A"}
              size={sc(18)}
              strokeWidth={sc(2.5)}
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
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  popup: {
    width: sc(295),
    padding: sc(24),
    borderRadius: sc(20),
  },
  title: {
    fontSize: sc(18),
  },
  buttonGroup: {
    gap: sc(12),
  },
});
