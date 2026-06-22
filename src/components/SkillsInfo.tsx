import { CodeSquare } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import useSkillStore from "../store/useSkillStore";
import useThemeStore from "../store/useThemeStore";
import { sc, vs } from "./../constants/responsive";
import SkillTag from "./SkillTag";
import SubmitButton from "./SubmitButton";
type SkillsInfoProps = {
  onClick: () => void;
};
export default function SkillsInfo({ onClick }: SkillsInfoProps) {
  const { theme } = useThemeStore();
  const { skills } = useSkillStore();
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
        <View
          style={styles.addStack}
          className="flex-row justify-evenly flex-wrap"
        >
          {skills.length > 0 ? (
            skills.map((item) => (
              <SkillTag key={item.id} skill={item} isCancel={false} />
            ))
          ) : (
            <Text
              className="text-textLight dark:text-textDark font-medium"
              style={{ fontSize: sc(11) }}
            >
              No skills selected
            </Text>
          )}
        </View>
      </View>
      <View className="mt-6">
        <SubmitButton
          buttonText="Manage Skills"
          isDisabled={false}
          onSubmit={onClick}
        />
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
  addStack: {
    width: "100%",
    justifyContent: "flex-start",
    gap: sc(10),
    marginTop: vs(10),
  },
});
