import AddButton from "@/src/components/AddButton";
import ButtonGroup from "@/src/components/ButtonGroup";
import SkillTag from "@/src/components/SkillTag";
import UserIconLogo from "@/src/components/UserIconLogo";
import useSkillStore from "@/src/store/useSkillStore";
import useThemeStore from "@/src/store/useThemeStore";
import { clsx } from "clsx";
import * as Crypto from "expo-crypto";
import { Image } from "expo-image";
import { Code } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { popularTechStacks } from "../../constants/popularTechStacks";
import { ms, sc, vs } from "../../constants/responsive";
import Skill from "../../constants/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TechStack() {
  const appTheme = useThemeStore((s) => s.theme);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>("");
  const { skills, addSkill, removeSkill } = useSkillStore();

  const { bottom } = useSafeAreaInsets();

  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);

  const handleAddNewSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;
    if (
      skills.some(
        (skill) => skill.stackName.toLowerCase() === trimmedSkill.toLowerCase(),
      )
    ) {
      Alert.alert(
        "Duplicate Skill Name",
        `${trimmedSkill} has already been added!`,
      );
      setNewSkill("");
      Keyboard.dismiss();
      return;
    }
    const newSkillItem: Skill = {
      id: Crypto.randomUUID(),
      stackName: trimmedSkill,
    };
    addSkill(newSkillItem);
    setNewSkill("");
    Keyboard.dismiss();
  };

  const handleSelectedSkill = (selectedSkill: Skill) => {
    if (
      skills.some(
        (skill) =>
          skill.stackName.toLowerCase() ===
          selectedSkill.stackName.toLowerCase(),
      )
    ) {
      Alert.alert(
        "Duplicate Skill Name",
        `${selectedSkill.stackName} has already been added!`,
      );
      return;
    }
    addSkill(selectedSkill);
  };

  const handleRemoveSkillItem = (skill_idToBeRemoved: string) => {
    removeSkill(skill_idToBeRemoved);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        className="bg-brandLight dark:bg-brandDark flex-1"
        style={{
          paddingBottom: bottom,
        }}
      >
        <ScrollView
          contentContainerStyle={shapes.main}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          className="bg-brandLight dark:bg-brandDark flex-1"
        >
          <View
            style={shapes.techStackContainer}
            className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-3xl shadow-sm dark:shadow-none w-full items-center"
          >
            <UserIconLogo icon={<Code size={sc(45)} stroke="dodgerblue" />} />

            <Text
              style={shapes.titleMessage}
              className="text-textLight dark:text-white font-nata-sans-bold mt-4"
            >
              What are your skills?
            </Text>
            <Text
              style={shapes.subtitleMessage}
              className="text-slate-500 dark:text-textDark font-nata-sans-medium mb-1 text-center"
            >
              Select your current tech stack and skills
            </Text>

            <Text
              style={shapes.titleMessage}
              className="text-textLight dark:text-white font-nata-sans-bold mt-6 mb-2"
            >
              Select Your Skills
            </Text>
            <Text
              style={shapes.introMessage}
              className="text-slate-500 dark:text-textDark font-nata-sans-medium text-center px-4 mb-5"
            >
              Choose the technologies and skills you&apos;re comfortable with
            </Text>

            {skills.length > 0 && (
              <View
                style={shapes.skillsContainer}
                className="self-start w-full"
              >
                <Text
                  style={{ fontSize: ms(13) }}
                  className="text-slate-500 dark:text-textDark mb-3 font-nata-sans-bold tracking-wider"
                >
                  ADDED SKILLS
                </Text>
                <View
                  style={shapes.addStack}
                  className="flex-row justify-start flex-wrap gap-2"
                >
                  {skills.map((item) => (
                    <SkillTag
                      key={item.id}
                      skill={item}
                      onRemove={handleRemoveSkillItem}
                      isCancel
                    />
                  ))}
                </View>
              </View>
            )}

            <View style={shapes.stackAdditionContainer}>
              <View
                style={shapes.input}
                className={clsx(
                  "bg-brandLight dark:bg-brandDark mb-5",
                  isFocus
                    ? "border border-accent-light dark:border-accent-dark2"
                    : "border border-borderLight dark:border-borderDark",
                )}
              >
                <TextInput
                  className="text-textLight dark:text-white font-nata-sans-medium justify-center"
                  cursorColor={appTheme === "light" ? "#4F46E5" : "#818CF8"}
                  placeholder="e.g. GraphQL, Kubernetes"
                  placeholderTextColor={
                    appTheme === "light" ? "#94A3B8" : "#64748B"
                  }
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={newSkill}
                  onChangeText={setNewSkill}
                />
              </View>
              <AddButton onPress={handleAddNewSkill} />
            </View>

            <Text
              style={{ fontSize: ms(13) }}
              className="text-slate-500 dark:text-textDark mt-4 mb-3 font-nata-sans-bold tracking-wider self-start pl-1"
            >
              POPULAR SKILLS
            </Text>

            <View style={shapes.stackContainer}>
              {popularTechStacks.map((item) => {
                const isSelected = skills.some((skill) => skill.id === item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      shapes.individualContainer,
                      isSelected && shapes.disabled,
                    ]}
                    className="bg-brandLight dark:bg-brandDark border border-borderLight dark:border-borderDark justify-center items-center shadow-sm dark:shadow-none"
                    disabled={isSelected}
                    onPress={() => handleSelectedSkill(item)}
                  >
                    <View style={shapes.content}>
                      <Image
                        source={item.icon}
                        style={{ height: vs(19), width: sc(19) }}
                        contentFit="contain"
                      />
                      <View style={shapes.stackDetails}>
                        <Text
                          style={shapes.stackName}
                          className="text-textLight dark:text-white font-nata-sans-bold"
                        >
                          {item.stackName}
                        </Text>
                        <Text
                          style={shapes.category}
                          className="text-slate-500 dark:text-textDark font-nata-sans-medium"
                        >
                          {item.category}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <ButtonGroup nextRoute="/(onboarding)/completionpage" />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const shapes = StyleSheet.create({
  main: {
    padding: sc(19),
    paddingBottom: vs(15),
    flexGrow: 1,
  },
  techStackContainer: {
    marginTop: vs(51),
    padding: ms(19),
  },
  titleMessage: {
    fontSize: ms(19),
  },
  subtitleMessage: {
    fontSize: ms(14),
  },
  introMessage: {
    fontSize: ms(14),
  },
  addStack: {
    width: "100%",
  },
  skillsContainer: {
    padding: sc(3),
    marginBottom: vs(12),
  },
  stackAdditionContainer: {
    width: "100%",
    flexDirection: "row",
    gap: sc(15), // Adjusted gap to ensure AddButton fits nicely
  },
  input: {
    flex: 1, // Changed from fixed 75% to flex 1 so it fills available space
    height: vs(36),
    borderRadius: sc(7),
    paddingHorizontal: sc(10),
  },
  stackName: {
    fontSize: ms(13.5),
  },
  category: {
    fontSize: ms(12),
  },
  stackContainer: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  individualContainer: {
    width: "48%",
    height: vs(65),
    padding: sc(2.5),
    borderRadius: ms(10),
    marginVertical: vs(6),
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: vs(8),
  },
  stackDetails: {
    flexDirection: "column",
  },
});
