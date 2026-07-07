import { useRouter, useNavigation } from "expo-router";
import { usePreventRemove } from "@react-navigation/native";
import { Alert, View } from "react-native";
import FormHeader from "../form-elements/FormHeader";
import FormLabel from "../form-elements/FormLabel";
import FormTextInput from "../form-elements/FormTextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import SelectionField from "../form-elements/SelectionField";
import SelectionBottomSheet from "../bottom-sheet-elements/SelectionBottomSheet";
import {
  PROJECT_CATEGORIES,
  ESTIMATED_TIMES,
  PROJECT_DOMAINS,
} from "../../../constants/projectFormData";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { presentBottomSheetModal } from "../utils/presentBottomSheetModal";
import useCreateProjectStore from "@/src/store/useCreateProjectStore";
import SubmitButton from "../../SubmitButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BasicDetails() {
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const categoryRef = useRef<BottomSheetModal | null>(null);
  const estimatedTimeRef = useRef<BottomSheetModal | null>(null);
  const domainRef = useRef<BottomSheetModal | null>(null);
  const project = useCreateProjectStore((s) => s.project);
  const updateProject = useCreateProjectStore((s) => s.update);
  const resetProject = useCreateProjectStore((s) => s.reset);

  const hasUnsavedChanges =
    project.projectName.trim() !== "" ||
    project.category !== "" ||
    project.domain !== "" ||
    project.estimatedTime !== "" ||
    project.description !== "" ||
    project.detailedDescription !== "" ||
    project.difficulty !== "Beginner" ||
    project.technologies.length > 0;

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert(
      "Discard Project?",
      "If you go back now, all progress will be lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            resetProject();
            navigation.dispatch(data.action);
          },
        },
      ],
    );
  });

  const navigateToDetailsScreen = () => {
    router.navigate("/(main)/manual-projects/create/details");
  };

  const handleCategorySelection = (category: string) => {
    updateProject({
      category,
    });
    categoryRef.current?.dismiss();
  };

  const handleEstimatedTimeSelection = (estimatedTime: string) => {
    updateProject({
      estimatedTime,
    });
    estimatedTimeRef.current?.dismiss();
  };

  const handleDomainSelection = (domain: string) => {
    updateProject({
      domain,
    });
    domainRef.current?.dismiss();
  };

  return (
    <View
      className="flex-1 bg-brandLight dark:bg-brandDark"
      style={{ paddingBottom: bottom }}
    >
      <FormHeader title="Create Project" subtitle="Let's start a new project" />
      <KeyboardAwareScrollView
        className="flex-1"
        bottomOffset={20}
        contentContainerStyle={{
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-7">
          <View className="gap-4">
            <FormLabel label="Project Name" />
            <FormTextInput
              value={project.projectName}
              onChangeText={(text) => {
                updateProject({
                  projectName: text,
                });
              }}
              placeholderText="Enter project name"
            />
          </View>

          <View className="gap-4">
            <FormLabel label="Category" />
            <SelectionField
              value={project.category}
              placeholder="Select Category"
              iconName="layers"
              onPress={() => presentBottomSheetModal(categoryRef)}
            />
          </View>

          <View className="gap-4">
            <FormLabel label="Estimated Time" />
            <SelectionField
              value={project.estimatedTime}
              placeholder="Select Estimated Time"
              iconName="clock"
              onPress={() => presentBottomSheetModal(estimatedTimeRef)}
            />
          </View>

          <View className="gap-4">
            <FormLabel label="Domain" />
            <SelectionField
              value={project.domain}
              placeholder="Select Domain"
              iconName="globe"
              onPress={() => domainRef.current?.present()}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View className="p-4 bg-brandLight dark:bg-brandDark">
        <SubmitButton buttonText="Next ▶" onSubmit={navigateToDetailsScreen} />
      </View>

      <SelectionBottomSheet
        ref={categoryRef}
        title="Select Category"
        data={PROJECT_CATEGORIES}
        selectedValue={project.category}
        onSelect={handleCategorySelection}
      />

      <SelectionBottomSheet
        ref={estimatedTimeRef}
        title="Select Estimated Time"
        data={ESTIMATED_TIMES}
        selectedValue={project.estimatedTime}
        onSelect={handleEstimatedTimeSelection}
      />

      <SelectionBottomSheet
        ref={domainRef}
        title="Select Domain"
        data={PROJECT_DOMAINS}
        selectedValue={project.domain}
        onSelect={handleDomainSelection}
      />
    </View>
  );
}
