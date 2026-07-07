import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import { sc } from "../constants/responsive";
import SubmitButton from "./SubmitButton";

type AccountSettingsProps = {
  appTheme: string;
  onResetPassword: () => void;
  onDeleteAccount: () => void;
  onChangePassword: () => void;
};

export default function AccountSettings({
  appTheme,
  onResetPassword,
  onDeleteAccount,
  onChangePassword,
}: AccountSettingsProps) {
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
            Account Security
          </Text>
        </View>

        <Text
          className="text-red-500/80 dark:text-red-400/80 font-nata-sans-medium"
          style={{ fontSize: sc(13) }}
        >
          Sensitive account actions require password verification.
        </Text>
      </View>

      <View className="gap-y-3">
        <SubmitButton
          buttonText="Forgot Password?"
          isDisabled={false}
          onSubmit={onResetPassword}
        />
        <SubmitButton
          buttonText="Change Password"
          isDisabled={false}
          onSubmit={onChangePassword}
        />

        <SubmitButton
          buttonText="Delete Account"
          isDisabled={false}
          isDelete={true}
          onSubmit={onDeleteAccount}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deletionContainer: {
    flexGrow: 1,
    width: "100%",
    borderRadius: sc(16),
    padding: sc(20),
  },

  heading: {
    fontSize: sc(20),
  },
});
