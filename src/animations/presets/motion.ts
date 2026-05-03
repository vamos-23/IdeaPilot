import { FadeOut, FadeInDown } from "react-native-reanimated";

export const ENTRY = {
  card: (index: number) =>
    FadeInDown.duration(600)
      .delay(index * 100)
      .springify()
      .damping(12)
      .stiffness(100),
};

export const EXIT = {
  card: FadeOut.duration(200),
};
