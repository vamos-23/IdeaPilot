import { View, Text } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheetSpringConfigs,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import useThemeStore from "@/src/store/useThemeStore";
import { forwardRef, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DIFFICULTY_LEVELS } from "@/src/constants/projectFormData";
import DifficultyCard from "./DifficultyCard";


type DifficultySelectionModalProps = {
  selectedDifficulty: string;
  onSelect: (difficulty: DIFFICULTY_LEVELS) => void;
};
const DifficultySelectionModal = forwardRef<
  BottomSheetModal,
  DifficultySelectionModalProps
>(({ selectedDifficulty, onSelect }, ref) => {
  const { bottom } = useSafeAreaInsets();
  const isDark = useThemeStore((s) => s.theme === "dark");

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 85,
    stiffness: 700,
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["53%"]}
      animationConfigs={animationConfigs}
      enableDynamicSizing={false}
      enablePanDownToClose
      enableOverDrag={false}
      enableHandlePanningGesture
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        width: 54,
        height: 5,
        borderRadius: 999,
        backgroundColor: isDark ? "#64748B" : "#CBD5E1",
      }}
      backgroundStyle={{
        backgroundColor: isDark ? "#182232" : "#FCFCFD",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}
    >
      <View className="px-6 pt-2 pb-5 border-b border-slate-200 dark:border-slate-700">
        <Text className="text-[24px] font-nata-sans-bold text-textLight dark:text-white">
          Choose Difficulty
        </Text>
        <Text className="mt-2 text-[15px] font-nata-sans-medium leading-6 text-slate-500 dark:text-slate-400">
          Select your project&apos;s difficulty.
        </Text>
      </View>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingHorizontal: 15,
          paddingBottom: bottom + 20,
          gap: 20,
        }}
      >
        <DifficultyCard
          title="Beginner"
          difficulty="BEGINNER"
          subtitle="Perfect for learning fundamentals and building your first projects."
          selected={selectedDifficulty === DIFFICULTY_LEVELS.BEGINNER}
          onSelect={() => onSelect(DIFFICULTY_LEVELS.BEGINNER)}
        />
        <DifficultyCard
          title="Intermediate"
          difficulty="INTERMEDIATE"
          subtitle="Requires familiarity with multiple technologies and project structure."
          selected={selectedDifficulty === DIFFICULTY_LEVELS.INTERMEDIATE}
          onSelect={() => onSelect(DIFFICULTY_LEVELS.INTERMEDIATE)}
        />
        <DifficultyCard
          title="Advanced"
          difficulty="ADVANCED"
          subtitle="Involves system design, scalability, optimization or advanced concepts."
          selected={selectedDifficulty === DIFFICULTY_LEVELS.ADVANCED}
          onSelect={() => onSelect(DIFFICULTY_LEVELS.ADVANCED)}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

DifficultySelectionModal.displayName = "DifficultySelectionModal";

export default DifficultySelectionModal;
