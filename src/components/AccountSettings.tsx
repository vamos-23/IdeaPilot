import { Alert, StyleSheet, Text, View } from "react-native";
import handleDeleteAccount from "../lib/account/handleDeleteAccount";
import { sc, vs } from "./../constants/responsive";
import SubmitButton from "./SubmitButton";
import Feather from "@expo/vector-icons/Feather";

type AccountSettingsProps = {
  appTheme: string;
};
export default function AccountSettings({ appTheme }: AccountSettingsProps) {
  const deletionAlert = () => {
    Alert.alert(
      "Are you sure?",
      "You are about to permanently delete your account. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ],
    );
  };
  
  return (
    <View
      className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 shadow-sm dark:shadow-none"
      style={styles.deletionContainer}
    >
      <View className="mb-6">
        <View className="gap-2 flex-row items-center mb-1">
          <Feather
            name="trash-2"
            color={appTheme === "light" ? "#DC2626" : "#EF4444"}
            size={sc(22)}
          />
          <Text
            className="text-red-600 dark:text-red-500 font-nata-sans-bold"
            style={styles.heading}
          >
            Danger Zone
          </Text>
        </View>
        <Text
          className="text-red-500/80 dark:text-red-400/80 font-nata-sans-medium"
          style={{ fontSize: sc(13) }}
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
  deletionContainer: {
    flexGrow: 1,
    width: "100%",
    borderRadius: sc(16),
    padding: sc(20),
    marginBottom: vs(40),
  },
  heading: { fontSize: sc(20) },
});
