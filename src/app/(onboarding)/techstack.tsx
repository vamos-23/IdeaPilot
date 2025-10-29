import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { sc, ms, vs } from "../../constants/responsive";
import { useState } from "react";
import { Code } from "lucide-react-native";
import UserIconLogo from "@/src/components/UserIconLogo";
import ThemeToggleButton from "@/src/components/ThemeToggle";
import { Image } from "expo-image";
import ButtonGroup from "@/src/components/ButtonGroup";
import useThemeStore from "@/src/store/useThemeStore";
import AddButton from "@/src/components/AddButton";
import { clsx } from "clsx";
import * as Crypto from "expo-crypto";
import { popularTechStacks } from "../../constants/popularTechStacks";
import useSkillStore from "@/src/store/useSkillStore";
import SkillTag from "@/src/components/SkillTag";
import Skill from "../../constants/types";

export default function WelcomeScreen() {
  const { theme } = useThemeStore();
  //to handle focus and unfocus effects of text input bar
  const [isFocus, setIsFocus] = useState<boolean>(false);
  //to handle the state for name of skill typed in text input bar
  const [newSkill, setNewSkill] = useState<string>("");
  //to handle the state of the array (list) containing each selected skill
  const { skills, addSkill, removeSkill } = useSkillStore();
  //functions to handle focus and de-focus effects of text input bar
  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);
  //Add a new skill from user-entered input
  const handleAddNewSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;
    if (
      skills.some(
        (skill) => skill.stackName.toLowerCase() === trimmedSkill.toLowerCase()
      )
    ) {
      Alert.alert(
        "Duplicate Skill Name",
        `${trimmedSkill} has already been added!`
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
  //Add skill item from popular skill list
  const handleSelectedSkill = (selectedSkill: Skill) => {
    if (
      skills.some(
        (skill) =>
          skill.stackName.toLowerCase() ===
          selectedSkill.stackName.toLowerCase()
      )
    ) {
      Alert.alert(
        "Duplicate Skill Name",
        `${selectedSkill.stackName} has already been added!`
      );
      return;
    }
    addSkill(selectedSkill);
  };

  //Deselect or remove skill item from skills list
  const handleRemoveSkillItem = (skill_idToBeRemoved: string) => {
    removeSkill(skill_idToBeRemoved);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={shapes.main}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="bg-brandLight dark:bg-brandDark flex-1"
      >
        <ThemeToggleButton />
        <View
          style={shapes.welcomeContainer}
          className="border-gray-300 dark:border-blue-600 bg-[#ffffff]
        dark:bg-[#111111de] items-center elevation-md dark:elevation-none"
        >
          <UserIconLogo icon={<Code size={sc(45)} stroke="dodgerblue" />} />
          <Text
            style={shapes.welcomeMessage}
            className=" dark:text-white font-semibold mb-2"
          >
            What are your skills?
          </Text>
          <Text
            style={shapes.subtitleMessage}
            className="text-textLight dark:text-textDark font-medium mb-1"
          >
            Select your current tech stack and skills
          </Text>
          <Text
            style={shapes.welcomeMessage}
            className="font-nata-sans-bold dark:text-white mt-4 mb-2"
          >
            Select Your Skills
          </Text>
          <Text
            style={shapes.introMessage}
            className="text-textLight dark:text-textDark font-medium px-4"
          >
            Choose the technologies and skills
          </Text>
          <Text
            style={shapes.introMessage}
            className="text-textLight dark:text-textDark font-medium mb-5"
          >
            you&apos;re comfortable with
          </Text>
          {skills.length > 0 && (
            <View style={shapes.skillsContainer} className="self-start">
              <Text
                style={{ fontSize: ms(16) }}
                className="text-textLight dark:text-textDark mb-3 font-medium"
              >
                ADDED SKILLS
              </Text>
              <View
                style={shapes.addStack}
                className="flex-row justify-evenly flex-wrap"
              >
                {skills.map((item) => (
                  <SkillTag
                    key={item.id}
                    skill={item}
                    onRemove={handleRemoveSkillItem}
                  />
                ))}
              </View>
            </View>
          )}
          <View style={shapes.stackAdditionContainer}>
            <View
              style={shapes.input}
              className={clsx(
                "bg-slate-300 dark:bg-[#293253] mb-5",
                isFocus
                  ? "border-blue-600 dark:border-blue-600"
                  : "border-[#307ae8b5] dark:border-blue-800"
              )}
            >
              <TextInput
                className="text-black dark:text-textDark font-semibold justify-center"
                cursorColor={theme === "light" ? "black" : "tomato"}
                placeholder="e.g. GraphQL, Kubernetes"
                placeholderTextColor={theme === "light" ? "dimgrey" : "silver"}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={newSkill}
                onChangeText={setNewSkill}
              />
            </View>
            <AddButton onPress={handleAddNewSkill} />
          </View>
          <Text
            style={{ fontSize: ms(16) }}
            className="text-textLight dark:text-textDark mb-3 font-medium self-start pl-1"
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
                  className="bg-[#e5e2e2] dark:bg-[#232348e4]
              border-orange-400 dark:border-orange-700 justify-center items-center elevation-md dark:elevation-none"
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
                        className="text-black dark:text-white font-semibold font-nata-sans-bold"
                      >
                        {item.stackName}
                      </Text>
                      <Text
                        style={shapes.category}
                        className="text-textLight dark:text-textDark font-semibold"
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
    </TouchableWithoutFeedback>
  );
}
const shapes = StyleSheet.create({
  main: {
    padding: sc(19),
    paddingBottom: vs(15),
    flexGrow: 1,
  },
  welcomeContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: vs(51),
    padding: ms(19),
    borderRadius: sc(17),
    borderWidth: sc(2),
  },
  welcomeMessage: {
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
    justifyContent: "flex-start",
    gap: sc(10),
  },
  skillsContainer: {
    padding: sc(3),
    marginBottom: vs(12),
  },
  stackAdditionContainer: {
    width: "100%",
    flexDirection: "row",
    gap: sc(25),
    paddingHorizontal: sc(1),
  },
  input: {
    width: "75%",
    height: vs(36),
    borderRadius: sc(7),
    borderWidth: sc(2),
    paddingHorizontal: sc(4),
  },
  stackName: {
    fontSize: ms(13.5),
  },
  category: {
    fontSize: ms(12),
  },
  stackContainer: {
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: sc(3),
    columnGap: sc(4),
  },
  individualContainer: {
    width: "47.5%",
    height: vs(65),
    padding: sc(2.5),
    borderRadius: ms(10),
    borderWidth: sc(2),
    marginVertical: vs(6),
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    alignContent: "center",
    flexDirection: "row",
    gap: vs(8),
  },
  stackDetails: {
    flexDirection: "column",
  },
});
