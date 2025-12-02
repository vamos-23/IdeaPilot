import { getAuth } from "firebase/auth";
import { User2Icon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import { sc, vs } from "./../constants/responsive";
// import SubmitButton from "./SubmitButton";
// import { handleFirebaseAuthError } from "../constants/authErrorHandler";
export default function ProfileInfo() {
  const { theme } = useThemeStore();
  const auth = getAuth();
  const user = auth.currentUser;
  const user_email = user?.email;
 // const username = user?.displayName;
  return (
    <View
      className="border-slate-600 dark:border-slate-600 bg-[#d8cece] dark:bg-[#121212]"
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
      <View className="gap-y-1 mb-5">
        <Text
          className="text-black dark:text-white font-medium"
          style={{ fontSize: sc(14) }}
        >
          Demo User
        </Text>
        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(10.5) }}
        >
          {user_email}
        </Text>
      </View>
      {/* <SubmitButton buttonText="Edit Profile" isDisabled={false} onSubmit={handleFirebaseAuthError}/> */}
    </View>
  );
}
const styles = StyleSheet.create({
  profile: {
    height: vs(192),
    width: "100%",
    borderWidth: sc(1),
    borderRadius: sc(17),
    padding: sc(18),
    marginTop: vs(45),
  },
  heading: {
    fontSize: sc(23),
  },
});
