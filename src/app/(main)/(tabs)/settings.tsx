//import ThemeToggleButton from "@/src/components/ThemeToggle";
import ProfileInfo from "@/src/components/ProfileInfo";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { sc } from "./../../../constants/responsive";
export default function Settings() {
  return (
    <ScrollView className="bg-brandLight dark:bg-brandDark flex-1 px-7"
    contentContainerStyle={{alignItems: "center"}}>
      {/* <ThemeToggleButton /> */}
      <View className="top-5 gap-y-1">
         <Text className="text-black dark:text-white font-nata-sans-bold" style={styles.title}>Settings</Text>
        <Text className="text-textLight dark:text-textDark font-semibold" style={styles.subtitle}>Manage your account settings and preferences</Text>
      </View>
      <ProfileInfo />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: sc(25)
  },
  subtitle: {
    fontSize: sc(12)
  }
})
