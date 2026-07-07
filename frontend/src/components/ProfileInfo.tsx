import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import { sc, vs } from "./../constants/responsive";
import SubmitButton from "./SubmitButton";
import useAuthStore from "../store/useAuthStore";

type ProfileInfoProps = { onEditProfile: () => void };

export default function ProfileInfo({ onEditProfile }: ProfileInfoProps) {
  const appTheme = useThemeStore((s) => s.theme);
  const user = useAuthStore((s) => s.user);

  return (
    <View
      className="border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark shadow-sm dark:shadow-none"
      style={styles.profile}
    >
      <View className="gap-y-1 mb-5">
        <View className="gap-2 flex-row items-center">
          <Feather
            name="user"
            size={sc(22)}
            color={appTheme === "light" ? "#0F172A" : "#F8FAFC"}
          />
          <Text
            className="text-textLight dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            Profile
          </Text>
        </View>
        <Text
          className="text-slate-500 dark:text-slate-400 font-nata-sans-medium"
          style={{ fontSize: sc(12) }}
        >
          Your personal information and preferences
        </Text>
      </View>

      <View className="mb-2 bg-brandLight dark:bg-brandDark p-4 rounded-xl border border-borderLight dark:border-borderDark">
        <Text
          className="text-textLight dark:text-white font-nata-sans-bold"
          style={{ fontSize: sc(15) }}
        >
          {user?.userName ?? "Guest"}
        </Text>
        <Text
          className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mt-1"
          style={{ fontSize: sc(13) }}
        >
          {user?.userEmail ?? "---"}
        </Text>
      </View>

      <View className="mt-4">
        <SubmitButton
          buttonText="Edit Profile"
          isDisabled={false}
          onSubmit={onEditProfile}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexGrow: 1,
    width: "100%",
    borderRadius: sc(16),
    padding: sc(20),
    marginBottom: vs(24),
  },
  heading: { fontSize: sc(20) },
});
