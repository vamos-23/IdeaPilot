import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Keyboard } from "react-native";

export const presentBottomSheetModal = (
  ref: React.RefObject<BottomSheetModal | null>,
) => {
  Keyboard.dismiss();
  requestAnimationFrame(() => {
    setTimeout(() => {
      ref.current?.present();
    }, 50);
  });
};
