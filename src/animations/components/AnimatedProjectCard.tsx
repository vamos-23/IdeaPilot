import Animated from "react-native-reanimated";
import { ENTRY, EXIT } from "../presets/motion";
import { LAYOUT } from "../presets/layout";
import { ProjectCard } from "../../components/ProjectCard";
import { ProjectIdea } from "../../constants/types";

type Props = {
  item: ProjectIdea;
  index: number;
};
export function AnimatedProjectCard({ item, index }: Props) {
  return (
    <Animated.View
      key={item.id}
      entering={ENTRY.card(index)}
      exiting={EXIT.card}
      layout={LAYOUT.card}
    >
      <ProjectCard item={item} />
    </Animated.View>
  );
}
