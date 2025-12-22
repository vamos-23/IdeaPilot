import { CodeSquare } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import { useState } from "react";
import { sc, vs } from "./../constants/responsive";
import SubmitButton from "./SubmitButton";
import SkillsModal from "./SkillsModal";
export default function SkillsInfo() {
  const { theme } = useThemeStore();
  const [showModal, setShowModal] = useState<boolean>(false);
  const closeSkillModal = () => setShowModal(false);
  return (
    <View
      className="border-[#D8DCE3] dark:border-[#333537] bg-[#EEF1F6] dark:bg-[#121720]"
      style={styles.skillInfo}
    >
      <View className="gap-y-1 mb-1">
        <View className="gap-2 flex-row items-center">
          <CodeSquare
            stroke={theme === "light" ? "#000000" : "#ffffff"}
            size={sc(24)}
          />
          <Text
            className="text-black dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            Your Skills
          </Text>
        </View>
        <Text
          className="text-textLight dark:text-textDark font-medium"
          style={{ fontSize: sc(11) }}
        >
          Manage your technical skills and expertise
        </Text>
        <View className="mt-6">
          <SubmitButton
            buttonText="Add/Remove Skills"
            isDisabled={false}
            onSubmit={() => (
              <SkillsModal visible={showModal} onClose={closeSkillModal} />
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skillInfo: {
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
