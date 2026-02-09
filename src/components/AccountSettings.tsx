import { View, Text, StyleSheet, Alert } from "react-native";
import { sc, vs } from "./../constants/responsive";
import useThemeStore from "../store/useThemeStore";
import { Trash2 } from "lucide-react-native";
import SubmitButton from "./SubmitButton";
import handleDeleteAccount from "../lib/account/handleDeleteAccount";

export default function AccountSettings() {
  const { theme } = useThemeStore();
  const deletionAlert = () => {
    return Alert.alert(
      "Are you sure?",
      "You are going to delete your account permanently.\nThis action can't be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            handleDeleteAccount();
          },
        },
      ],
    );
  };

  return (
    <View
      className="border-[#dc2626] dark:border-[#ef4444] bg-[#EEF1F6] dark:bg-[#121720]"
      style={styles.deletion_container}
    >
      <View className="mb-7">
        <View className="gap-2 flex-row items-center">
          <Trash2
            stroke={theme === "light" ? "#dc2626" : "#ef4444"}
            size={sc(24)}
          />
          <Text
            className="text-red-600 dark:text-red-500 font-nata-sans-bold"
            style={styles.heading}
          >
            Danger Zone!
          </Text>
        </View>
        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(11) }}
        >
          Account deletion ahead!
        </Text>
      </View>
      <SubmitButton
        buttonText="Delete Account"
        isDisabled={false}
        isDelete={true}
        onSubmit={deletionAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  deletion_container: {
    flexGrow: 1,
    width: "100%",
    borderWidth: sc(1),
    borderRadius: sc(17),
    padding: sc(20),
    marginBottom: vs(28),
  },
  heading: {
    fontSize: sc(23),
  },
});
