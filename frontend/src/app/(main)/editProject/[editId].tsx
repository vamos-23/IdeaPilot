import { View } from "react-native";
import FormHeader from "@/src/components/manual-projects/form-elements/FormHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectionBottomSheet from "@/src/components/manual-projects/bottom-sheet-elements/SelectionBottomSheet";
import FormLabel from "@/src/components/manual-projects/form-elements/FormLabel";
import FormTextInput from "@/src/components/manual-projects/form-elements/FormTextInput";
import SelectionField from "@/src/components/manual-projects/form-elements/SelectionField";
import { presentBottomSheetModal } from "@/src/components/manual-projects/utils/presentBottomSheetModal";
import SubmitButton from "@/src/components/SubmitButton";
import {
  PROJECT_CATEGORIES,
  ESTIMATED_TIMES,
  PROJECT_DOMAINS,
} from "@/src/constants/projectFormData";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useProjectStore from "@/src/store/useProjectStore";
import { updateProject as updateProjectService } from "@/src/services/ideas/projects.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, useTransition } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Difficulty } from "@/src/constants/types";
import DifficultySelectionModal from "@/src/components/manual-projects/bottom-sheet-elements/DifficultySelectionModal";
import useAuthStore from "@/src/store/useAuthStore";
import Toast from "react-native-toast-message";
import { vs } from "react-native-size-matters";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

export default function EditProject() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [isReady, setReady] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { editId } = useLocalSearchParams();
  const userId = useAuthStore((s) => s.user?.userId);
  const projects = useProjectStore((s) => s.projects);

  const currentProject = projects.find((project) => project.id === editId);

  const [projectName, setProjectName] = useState(
    currentProject?.projectName ?? "",
  );
  const [category, setCategory] = useState(currentProject?.category ?? "");
  const [domain, setDomain] = useState(currentProject?.domain ?? "");
  const [difficulty, setDifficulty] = useState(
    currentProject?.difficulty ?? "Beginner",
  );
  const [estimatedTime, setEstimatedTime] = useState(
    currentProject?.estimatedTime ?? "",
  );
  const [description, setDescription] = useState(
    currentProject?.description ?? "",
  );
  const [detailedDescription, setDetailedDescription] = useState(
    currentProject?.detailedDescription ?? "",
  );

  const categoryRef = useRef<BottomSheetModal | null>(null);
  const estimatedTimeRef = useRef<BottomSheetModal | null>(null);
  const domainRef = useRef<BottomSheetModal | null>(null);
  const difficultyRef = useRef<BottomSheetModal | null>(null);

  const updateLocalProject = useProjectStore((s) => s.updateProjectsOnEdit);

  const handleDifficultyLevel = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    difficultyRef.current?.dismiss();
  };

  const handleCategorySelection = (category: string) => {
    setCategory(category);
    categoryRef.current?.dismiss();
  };

  const handleEstimatedTimeSelection = (estimatedTime: string) => {
    setEstimatedTime(estimatedTime);
    estimatedTimeRef.current?.dismiss();
  };

  const handleDomainSelection = (domain: string) => {
    setDomain(domain);
    domainRef.current?.dismiss();
  };

  const saveEdits = async () => {
    if (!userId || !currentProject) return;
    setLoading(true);
    try {
      const updates = {
        projectName,
        category,
        estimatedTime,
        domain,
        difficulty,
        description,
        detailedDescription,
      };

      await updateProjectService(userId, currentProject.id, updates);

      updateLocalProject(currentProject.id, updates);

      Toast.show({
        type: "success",
        text1: "Project updated 🎉",
        text2: "Your changes have been saved.",
        topOffset: vs(35),
      });

      router.dismissTo(`/(main)/customProject/${currentProject.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Please try again.";
      Toast.show({
        type: "error",
        text1: "Update failed!",
        text2: errorMessage,
        topOffset: vs(35),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setReady(true);
      });
    }, 350);

    return () => clearTimeout(timer);
  }, []);

  if (isPending || !isReady) {
    return <View className="flex-1 bg-brandLight dark:bg-brandDark" />;
  }
  return (
    <View
      className="flex-1 bg-brandLight dark:bg-brandDark"
      style={{ paddingBottom: bottom }}
    >
      <FormHeader
        title="Edit Your Project"
        subtitle="You can make changes to your project metadata here."
      />
      <KeyboardAwareScrollView
        className="flex-1"
        bottomOffset={20}
        contentContainerStyle={{
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          exiting={FadeIn.duration(400).springify()}
        >
          <View className="gap-7">
            <View className="gap-4">
              <FormLabel label="Project Name" />
              <FormTextInput
                value={projectName}
                onChangeText={setProjectName}
                placeholderText="Enter project name"
              />
            </View>

            <View className="gap-4">
              <FormLabel label="Category" />
              <SelectionField
                value={category}
                placeholder="Select Category"
                iconName="layers"
                onPress={() => presentBottomSheetModal(categoryRef)}
              />
            </View>

            <View className="gap-4">
              <FormLabel label="Estimated Time" />
              <SelectionField
                value={estimatedTime}
                placeholder="Select Estimated Time"
                iconName="clock"
                onPress={() => presentBottomSheetModal(estimatedTimeRef)}
              />
            </View>

            <View className="gap-4">
              <FormLabel label="Domain" />
              <SelectionField
                value={domain}
                placeholder="Select Domain"
                iconName="globe"
                onPress={() => domainRef.current?.present()}
              />
            </View>
            <View className="gap-4">
              <FormLabel label="Difficulty" />
              <SelectionField
                value={difficulty}
                placeholder="Choose Difficulty"
                iconName="target"
                onPress={() => presentBottomSheetModal(difficultyRef)}
              />
            </View>
            <View className="gap-4">
              <FormLabel label="Short Description" />
              <FormTextInput
                value={description}
                onChangeText={setDescription}
                isMultiline
                placeholderText="What's your project about?"
              />
            </View>
            <View className="gap-4">
              <FormLabel label="Detailed Description" />
              <FormTextInput
                value={detailedDescription}
                onChangeText={setDetailedDescription}
                isMultiline
                placeholderText="Explain your project in detail..."
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>

      <View className="p-4 bg-brandLight dark:bg-brandDark">
        <SubmitButton
          buttonText="Save Changes"
          isLoading={isLoading}
          loadingText="Saving your changes..."
          onSubmit={saveEdits}
        />
      </View>

      <SelectionBottomSheet
        ref={categoryRef}
        title="Select Category"
        data={PROJECT_CATEGORIES}
        selectedValue={category}
        onSelect={handleCategorySelection}
      />

      <SelectionBottomSheet
        ref={estimatedTimeRef}
        title="Select Estimated Time"
        data={ESTIMATED_TIMES}
        selectedValue={estimatedTime}
        onSelect={handleEstimatedTimeSelection}
      />

      <SelectionBottomSheet
        ref={domainRef}
        title="Select Domain"
        data={PROJECT_DOMAINS}
        selectedValue={domain}
        onSelect={handleDomainSelection}
      />
      <DifficultySelectionModal
        ref={difficultyRef}
        selectedDifficulty={difficulty}
        onSelect={handleDifficultyLevel}
      />
    </View>
  );
}
