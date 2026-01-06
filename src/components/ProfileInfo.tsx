import { User2Icon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import { sc, vs } from "./../constants/responsive";
import SubmitButton from "./SubmitButton";

type ProfileInfoProps = {
  onEditProfile: () => void;
};

export default function ProfileInfo({ onEditProfile }: ProfileInfoProps) {
  const { theme } = useThemeStore();
  const user = useAuthStore((state) => state.user);
  return (
    <View
      className="border-[#D8DCE3] dark:border-[#333537] bg-[#EEF1F6] dark:bg-[#121720]"
      style={styles.profile}
    >
      <View className="gap-y-1 mb-5">
        <View className="gap-2 flex-row items-center">
          <User2Icon
            stroke={theme === "light" ? "#000000" : "#ffffff"}
            size={sc(24)}
          />
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            Profile
          </Text>
        </View>

        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(11) }}
        >
          Your personal information and preferences
        </Text>
      </View>

      <View className="mb-2">
        <Text
          className="text-black dark:text-white font-bold"
          style={{ fontSize: sc(14) }}
        >
          {user?.userName ?? "No Name"}
        </Text>

        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(10.5) }}
        >
          {user?.userEmail ?? "--"}
        </Text>
      </View>

      <View className="mt-3">
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
    borderWidth: sc(1),
    borderRadius: sc(17),
    padding: sc(20),
    marginBottom: vs(28),
  },
  heading: {
    fontSize: sc(23),
  },
});
