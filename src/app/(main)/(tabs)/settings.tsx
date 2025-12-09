//import ThemeToggleButton from "@/src/components/ThemeToggle";
import EditProfilePopup from "@/src/components/EditProfilePopup";
import NameInputPopup from "@/src/components/NameInputPopup";
import Notifications from "@/src/components/Notifications";
import ProfileInfo from "@/src/components/ProfileInfo";
import SkillsInfo from "@/src/components/SkillsInfo";
import ThemeSettings from "@/src/components/ThemeSettings";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { sc, vs } from "./../../../constants/responsive";
export default function Settings() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showNamePopup, setShowNamePopup] = useState<boolean>(false);
  const [showEmailPopup, setShowEmailPopup] = useState<boolean>(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState<boolean>(false);
  //EditProfilePopup
  const onClosePopup = () => setShowPopup(false);
  const onCloseNamePopup = () => setShowNamePopup(false);
  const openEditProfile = () => setShowPopup(true);
  //NameInputPopup
  const onCloseName = () => {
    setShowNamePopup(false);
    setShowPopup(true);
  };
  const onCloseEmail = () => {
    setShowEmailPopup(false);
    setShowPopup(true);
  };
  const onClosePassword = () => {
    setShowPasswordPopup(false);
    setShowPopup(true);
  };
  const openNamePopup = () => {
    setShowPopup(false);
    setShowNamePopup(true);
  };
  const openEmailPopup = () => {
    setShowPopup(false);
    setShowEmailPopup(true);
  };
  const openPasswordPopup = () => {
    setShowPopup(false);
    setShowPasswordPopup(true);
  };
  //EmailInputPopup
  return (
    <View className="flex-1">
      <ScrollView
        className="bg-brandLight dark:bg-[#011035] px-7"
        contentContainerStyle={{ alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="top-5 mb-16 gap-y-1">
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.title}
          >
            Settings
          </Text>
          <Text
            className="text-textLight dark:text-textDark font-semibold"
            style={styles.subtitle}
          >
            Manage your account settings and preferences
          </Text>
        </View>
        <ProfileInfo onEditProfile={openEditProfile} />
        <SkillsInfo />
        <ThemeSettings />
        <Notifications />
      </ScrollView>
      {showPopup && (
        <EditProfilePopup
          onClose={onClosePopup}
          onEditName={openNamePopup}
          onEditEmail={openEmailPopup}
          onChangePassword={openPasswordPopup}
        />
      )}
      {showNamePopup && (
        <NameInputPopup
          onClose={onCloseName}
          showNamePopup={onCloseNamePopup}
          showEditPopup={onClosePopup}
        />
      )}
      {/* {showPasswordPopup && (
        <PasswordInputPopup
          onClose={onClosePassword}
          onOpenPasswordPopup={openPasswordPopup}
        />
      )} */}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: sc(25),
  },
  subtitle: {
    fontSize: sc(12),
  },
  scrollView: {
    flexGrow: 1,
    padding: sc(23),
    marginBottom: vs(25),
    justifyContent: "center",
    alignItems: "center",
  },
});
