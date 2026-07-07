import { StyleSheet, Text, View } from "react-native";
import useThemeStore from "../store/useThemeStore";
import useSkillStore from "../store/useSkillStore";
import { sc, vs } from "./../constants/responsive";
import SkillTag from "./SkillTag";
import Octicons from "@expo/vector-icons/Octicons";
import SubmitButton from "./SubmitButton";

type SkillsInfoProps = { onClick: () => void };

export default function SkillsInfo({ onClick }: SkillsInfoProps) {
  const appTheme = useThemeStore((s) => s.theme);
  const skills = useSkillStore((s) => s.skills);

  return (
    <View
      className="border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark shadow-sm dark:shadow-none"
      style={styles.skillInfo}
    >
      <View className="gap-y-1 mb-2">
        <View className="gap-2 flex-row items-center">
          <Octicons
            name="code-square"
            color={appTheme === "light" ? "#0F172A" : "#F8FAFC"}
            size={sc(22)}
          />

          <Text
            className="text-textLight dark:text-white font-nata-sans-bold"
            style={styles.heading}
          >
            Your Skills
          </Text>
        </View>
        <Text
          className="text-slate-500 dark:text-slate-400 font-nata-sans-medium"
          style={{ fontSize: sc(12) }}
        >
          Manage your technical skills and expertise
        </Text>

        <View
          style={styles.addStack}
          className="flex-row justify-start flex-wrap gap-2 mt-3"
        >
          {skills.length > 0 ? (
            skills.map((item) => (
              <SkillTag key={item.id} skill={item} isCancel={false} />
            ))
          ) : (
            <Text
              className="text-slate-400 dark:text-slate-500 font-nata-sans-medium italic mt-1"
              style={{ fontSize: sc(12) }}
            >
              No skills selected
            </Text>
          )}
        </View>
      </View>
      <View className="mt-5">
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
    borderRadius: sc(16),
    padding: sc(20),
    marginBottom: vs(24),
  },
  heading: { fontSize: sc(20) },
  addStack: { width: "100%" },
});
