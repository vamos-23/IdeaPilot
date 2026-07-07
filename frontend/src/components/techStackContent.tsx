import AddButton from "@/src/components/AddButton";
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { popularTechStacks } from "../constants/popularTechStacks";
import { ms, sc, vs } from "../constants/responsive";
import Skill from "../constants/types";

export default function TechStackContent() {
  const appTheme = useThemeStore((s) => s.theme);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>("");
  const skills = useSkillStore(s => s.skills);
  const addSkill = useSkillStore(s => s.addSkill);
  const removeSkill = useSkillStore(s => s.removeSkill);
  
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
    <View
      style={shapes.techStackContainer}
      className="bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark rounded-3xl shadow-sm dark:shadow-none items-center"
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
        className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mb-1 text-center"
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
        className="text-slate-500 dark:text-slate-400 font-nata-sans-medium text-center px-4 mb-5"
      >
        Choose the technologies and skills you&apos;re comfortable with
      </Text>

      {skills.length > 0 && (
        <View style={shapes.skillsContainer} className="self-start w-full">
          <Text
            style={{ fontSize: ms(13) }}
            className="text-slate-500 dark:text-slate-400 mb-3 font-nata-sans-bold tracking-wider"
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
            "bg-brandLight dark:bg-brandDark mb-5", // Maps to the app bg to create an inset look
            isFocus
              ? "border border-accent-light dark:border-accent-dark2"
              : "border border-borderLight dark:border-borderDark",
          )}
        >
          <TextInput
            className="text-textLight dark:text-textDark font-nata-sans-medium justify-center flex-1"
            cursorColor={appTheme === "light" ? "#4F46E5" : "#818CF8"} // Accent colors
            placeholder="e.g. GraphQL, Kubernetes"
            placeholderTextColor={appTheme === "light" ? "#94A3B8" : "#64748B"}
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
        className="text-slate-500 dark:text-slate-400 mt-4 mb-3 font-nata-sans-bold tracking-wider self-start pl-1"
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
              className="bg-brandLight dark:bg-brandDark border border-borderLight dark:border-borderDark justify-center items-center rounded-2xl shadow-sm dark:shadow-none"
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
                    className="text-slate-500 dark:text-slate-400 font-nata-sans-medium mt-0.5"
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
  );
}

const shapes = StyleSheet.create({
  techStackContainer: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: vs(16),
    padding: ms(19),
    marginBottom: vs(20)
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
    gap: sc(15), // Unified gap for the Add button
  },
  input: {
    flex: 1, // Fills available space elegantly
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
    padding: sc(3),
  },
  individualContainer: {
    width: "48%", // Unified grid widths
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
