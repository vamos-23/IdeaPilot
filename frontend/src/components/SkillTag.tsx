import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { X, Code } from "lucide-react-native";
import { vs, sc } from "../constants/responsive";
import Skill from "../constants/types";
import useThemeStore from "../store/useThemeStore";
type SkillTagProps = {
  skill: Skill;
  isCancel: boolean;
  onRemove?: (id: string) => void;
};
export default function SkillTag({ skill, onRemove, isCancel }: SkillTagProps) {
  const appTheme = useThemeStore(s => s.theme);
  return (
    <TouchableOpacity
      key={skill.id}
      style={shapes.skillTag}
      className="bg-[#e5e2e2] dark:bg-[#2a2a6ce4]"
      onPress={() => onRemove?.(skill.id)}
      activeOpacity={0.8}
    >
      <View className="justify-center items-center flex-row gap-3">
        <Code
          size={sc(16)}
          color={appTheme === "light" ? "orangered" : "#48C9B0"}
        />
        <Text className="text-black dark:text-white font-nata-sans-bold">
          {skill.stackName}
        </Text>
        {isCancel && (<X size={sc(15)} color={appTheme === "light" ? "crimson" : "red"} />)}
      </View>
    </TouchableOpacity>
  );
}
const shapes = StyleSheet.create({
  skillTag: {
    borderRadius: sc(15),
    paddingVertical: vs(5),
    padding: sc(10),
  },
});
