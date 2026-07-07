import { Text, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useThemeStore from "@/src/store/useThemeStore";
import {
  SelectionItem,
  STATIC_SPRING_CONFIGS,
} from "../../../constants/projectFormData";
import SelectionItemComponent from "./SelectionItemComponent";

type SelectionBottomSheetProps = {
  title: string;
  data: SelectionItem[];
  selectedValue: string;
  onSelect: (item: string) => void;
};

const SelectionBottomSheet = forwardRef<
  BottomSheetModal,
  SelectionBottomSheetProps
>(({ title, data, selectedValue, onSelect }, ref) => {
  const { bottom } = useSafeAreaInsets();
  const isDark = useThemeStore((s) => s.theme === "dark");
  const snapPoints = useMemo(() => ["53%"], []);

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
      <SelectionItemComponent
        itemLabel={item.label}
        selected={selectedValue === item.label}
        onSelect={onSelect}
      />
    ),
    [selectedValue, onSelect],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      animationConfigs={STATIC_SPRING_CONFIGS}
      enableDynamicSizing
      enablePanDownToClose
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
      <View className="border-b border-slate-200 px-6 pb-4 pt-3 dark:border-slate-700">
        <Text className="text-[24px] font-nata-sans-bold text-textLight dark:text-white">
          {title}
        </Text>
      </View>

      <BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderBottomSheetItem}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={3}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: bottom + 18,
        }}
      />
    </BottomSheetModal>
  );
});

SelectionBottomSheet.displayName = "SelectionBottomSheet";

export default SelectionBottomSheet;
