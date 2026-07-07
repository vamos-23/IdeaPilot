import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { View, Text, useWindowDimensions } from "react-native";
import type { TextInput as GestureTextInput } from "react-native-gesture-handler";
import {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import useThemeStore from "@/src/store/useThemeStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SelectionItem,
  STATIC_SPRING_CONFIGS,
} from "@/src/constants/projectFormData";
import TechnologyItem from "./TechnologyItem";
import TechnologyChip from "./TechnologyChip";
import SubmitButton from "../../SubmitButton";

type TechStackBottomSheetProps = {
  data: SelectionItem[];
  technologies: string[];
  onTechnologiesChange: (technologies: string[]) => void;
  isLoading?: boolean;
  saveButton?: boolean;
  onSubmit?: () => void;
};

const TechStackBottomSheet: React.ForwardRefExoticComponent<
  TechStackBottomSheetProps & React.RefAttributes<BottomSheetModal>
> = forwardRef<BottomSheetModal, TechStackBottomSheetProps>(
  (
    {
      data,
      technologies,
      onTechnologiesChange,
      isLoading = false,
      saveButton = false,
      onSubmit,
    },
    ref,
  ) => {
    const { bottom } = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const isDark = useThemeStore((s) => s.theme === "dark");

    const [searchQuery, setSearchQuery] = useState<string>("");
    const inputRef = useRef<GestureTextInput | null>(null);
    const searchRef = useRef<string>("");
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const snapPoints = useMemo(() => [height - 100], [height]);

    const selectedSet = useMemo(() => {
      return new Set(technologies);
    }, [technologies]);

    const toggleTechnology = useCallback(
      (technology: string) => {
        if (technologies.includes(technology)) {
          onTechnologiesChange(
            technologies.filter((tech) => tech !== technology),
          );
        } else {
          onTechnologiesChange([...technologies, technology]);
        }
      },
      [technologies, onTechnologiesChange],
    );

    const filteredTechnologies = useMemo(() => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return data;
      return data.filter((tech) => tech.label.toLowerCase().includes(query));
    }, [data, searchQuery]);

    const addTechnology = useCallback(() => {
      const technology = searchQuery.trim();
      if (!technology) return;
      const existing = technologies.some(
        (tech) => tech.toLowerCase() === technology.toLowerCase(),
      );
      if (existing) return;
      searchRef.current = "";
      setSearchQuery("");
      inputRef.current?.clear();
      onTechnologiesChange([...technologies, technology]);
    }, [searchQuery, technologies, onTechnologiesChange]);

    const handleDismiss = () => {
      searchRef.current = "";
      setSearchQuery("");
      inputRef.current?.clear();
    };

    useEffect(() => {
      return () => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      };
    }, []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.45}
        />
      ),
      [],
    );

    const renderBottomSheetItem = useCallback(
      ({ item }: { item: SelectionItem }) => (
        <TechnologyItem
          itemName={item.label}
          selected={selectedSet.has(item.label)}
          onPress={toggleTechnology}
        />
      ),
      [selectedSet, toggleTechnology],
    );

    const EmptyStateComponent = useCallback(() => {
      return (
        <View className="h-44 p-4 mt-5 mx-5 rounded-2xl border border-blue-400 dark:border-[#4169e1] bg-cardLight/20 dark:bg-cardDark/30">
          <View className="flex-1 gap-4">
            <Text className="text-textLight dark:text-slate-100 font-nata-sans-bold text-center">
              No technology found. Would you like to add{" "}
              <Text className="text-md font-nata-sans-bold tracking-wider text-blue-600 dark:text-[#83a2fd]">
                {searchQuery.trim()}
              </Text>
              ?
            </Text>
            <SubmitButton
              buttonText={`Add ${searchQuery.trim()}`}
              onSubmit={addTechnology}
            />
          </View>
        </View>
      );
    }, [searchQuery, addTechnology]);

    return (
      <BottomSheetModal
        ref={ref}
        animateOnMount
        animationConfigs={STATIC_SPRING_CONFIGS}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableHandlePanningGesture
        enableOverDrag={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enableBlurKeyboardOnGesture
        android_keyboardInputMode="adjustPan"
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
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
        <View className="px-6 pb-2 pt-3"  style={{ paddingBottom: bottom }}>
          <Text className="text-[24px] font-nata-sans-bold text-textLight dark:text-white">
            Choose your Tech Stack
          </Text>
          <View className="my-2 gap-5">
            <Text className="text-[15px] leading-6 font-nata-sans-medium text-slate-500 dark:text-slate-400">
              Search for technologies
            </Text>
            <BottomSheetTextInput
              ref={inputRef}
              placeholder="e.g. React, JavaScript, Java, etc."
              placeholderTextColor={isDark ? "#94A3B8" : "#64748B"}
              className="h-14 rounded-2xl border border-slate-300 bg-slate-100 px-5 text-base text-textLight dark:border-slate-700 dark:bg-[#202B3D] dark:text-white"
              onChangeText={(text) => {
                searchRef.current = text;
                if (debounceTimeout.current) {
                  clearTimeout(debounceTimeout.current);
                }
                debounceTimeout.current = setTimeout(() => {
                  setSearchQuery(searchRef.current);
                }, 150);
              }}
            />
          </View>

          <Text className="mt-3 text-[15px] font-nata-sans-medium leading-6 text-slate-600 dark:text-slate-400">
            Selected Technologies
          </Text>
          <View className="flex-wrap my-3">
            {technologies.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {technologies.map((tech) => (
                  <TechnologyChip
                    key={tech}
                    techStack={tech}
                    isDark={isDark}
                    isCancellable={true}
                    onPress={toggleTechnology}
                  />
                ))}
              </View>
            ) : (
              <Text className="text-md font-nata-sans-medium text-blue-600 dark:text-slate-300">
                No technology selected
              </Text>
            )}
          </View>
          <View className="flex-row my-2 items-center justify-center gap-3">
            <Text className="text-[15px] font-nata-sans-medium leading-6 text-slate-600 dark:text-slate-400">
              🔥 Popular Technologies
            </Text>
            <View className="mt-1 h-[1px] flex-1 bg-slate-300 dark:bg-slate-600" />
          </View>
        </View>
        {searchQuery.trim() !== "" && filteredTechnologies.length === 0 && (
          <EmptyStateComponent />
        )}
        <BottomSheetFlatList
          data={filteredTechnologies}
          keyExtractor={(item) => item.id}
          renderItem={renderBottomSheetItem}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={5}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 18,
            paddingTop: 15,
            paddingBottom: bottom + 18,
          }}
        />
        {saveButton && (
          <View className="px-5 pb-6 pt-2 bg-[#FCFCFD] dark:bg-[#182232]">
            <SubmitButton
              buttonText="Save Changes"
              isLoading={isLoading}
              loadingText="Saving your changes..."
              onSubmit={onSubmit!}
            />
          </View>
        )}
      </BottomSheetModal>
    );
  },
);

TechStackBottomSheet.displayName = "TechStackBottomSheet";
export default memo(TechStackBottomSheet);
