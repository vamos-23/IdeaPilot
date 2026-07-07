import { View } from "react-native";
import { Difficulty } from "@/src/constants/types";
import FormHeader from "../form-elements/FormHeader";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import FormLabel from "../form-elements/FormLabel";
import FormTextInput from "../form-elements/FormTextInput";
import SelectionField from "../form-elements/SelectionField";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import DifficultySelectionModal from "../bottom-sheet-elements/DifficultySelectionModal";
import { TECHNOLOGIES } from "@/src/constants/projectFormData";
import { presentBottomSheetModal } from "../utils/presentBottomSheetModal";
import TechStackBottomSheet from "../bottom-sheet-elements/TechStackBottomSheet";
import useCreateProjectStore from "@/src/store/useCreateProjectStore";
import useProjectStore from "@/src/store/useProjectStore";
import { createProject } from "../../../services/ideas/projects.service";
import useAuthStore from "@/src/store/useAuthStore";
import { useRouter } from "expo-router";
import SubmitButton from "../../SubmitButton";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Details() {
  const { bottom } = useSafeAreaInsets();

  const difficultyRef = useRef<BottomSheetModal | null>(null);
  const techStackRef = useRef<BottomSheetModal | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userId = useAuthStore((s) => s.user?.userId);
  const username = useAuthStore((s) => s.user?.userName);

  const project = useCreateProjectStore((s) => s.project);
  const updateProject = useCreateProjectStore((s) => s.update);
  const reset = useCreateProjectStore((s) => s.reset);

  const addProject = useProjectStore((s) => s.addProject);

  const router = useRouter();

  const isFormSubmissionValid =
    project.projectName.trim() !== "" &&
    project.category !== "" &&
    project.domain !== "" &&
    project.description !== "" &&
    project.estimatedTime !== "" &&
    project.detailedDescription !== "" &&
    project.difficulty !== "Beginner" &&
    project.technologies.length !== 0;

  const saveProject = async () => {
    if (!userId) return;
    if (!isFormSubmissionValid) {
      Toast.show({
        type: "error",
        text1: "Incomplete Project",
        text2: "Please complete all fields in the form before saving.",
      });
      return;
    }
    if (project.technologies.length <= 1) {
      Toast.show({
        type: "info",
        text1: `Hey there, ${username}!`,
        text2:
          "A gentle suggestion: Add atleast 2 technologies for your project.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const savedProject = await createProject(userId, project);
      addProject(savedProject);
      reset();
      router.dismissTo("/(main)/manual-projects");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "There was some unexpected error. Please try again later.";
      Toast.show({
        type: "error",
        text1: "Project Creation failed!",
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDifficultyLevel = (difficulty: Difficulty) => {
    updateProject({
      difficulty,
    });
    difficultyRef.current?.dismiss();
  };

  return (
    <View
      className="flex-1 bg-brandLight dark:bg-brandDark"
      style={{ paddingBottom: bottom }}
    >
      <FormHeader
        title="Project Details"
        subtitle="Describe your project and choose your technologies"
      />

      <KeyboardAwareScrollView
        className="flex-1"
        bottomOffset={60}
        contentContainerStyle={{
          padding: 20,
          paddingVertical: 22,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-7">
          <View className="gap-4">
            <FormLabel label="Difficulty" />
            <SelectionField
              value={project.difficulty}
              placeholder="Choose Difficulty"
              iconName="target"
              onPress={() => presentBottomSheetModal(difficultyRef)}
            />
          </View>
          <View className="gap-4">
            <FormLabel label="Short Description" />
            <FormTextInput
              value={project.description}
              onChangeText={(text) => {
                updateProject({
                  description: text,
                });
              }}
              isMultiline
              placeholderText="What's your project about?"
            />
          </View>
          <View className="gap-4">
            <FormLabel label="Detailed Description" />
            <FormTextInput
              value={project.detailedDescription}
              onChangeText={(text) => {
                updateProject({
                  detailedDescription: text,
                });
              }}
              isMultiline
              placeholderText="Explain your project in detail..."
            />
          </View>
          <View className="gap-4">
            <FormLabel label="Technology Stack" />
            <SelectionField
              value={project.technologies}
              placeholder="Select Technologies"
              iconName="cpu"
              onPress={() => presentBottomSheetModal(techStackRef)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View className="p-4 bg-brandLight dark:bg-brandDark">
        <SubmitButton
          buttonText="Save Project"
          loadingText="Saving Project..."
          isLoading={isLoading}
          onSubmit={saveProject}
        />
      </View>
      <DifficultySelectionModal
        ref={difficultyRef}
        selectedDifficulty={project.difficulty}
        onSelect={handleDifficultyLevel}
      />
      <TechStackBottomSheet
        ref={techStackRef}
        data={TECHNOLOGIES}
        technologies={project.technologies}
        onTechnologiesChange={(technologies) => {
          updateProject({ technologies });
        }}
      />
    </View>
  );
}
