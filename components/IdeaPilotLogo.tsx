import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Zap } from "lucide-react-native";
import { sc } from "../constants/responsive";

const IdeaPilotLogo = () => {
  const size = sc(70);

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      <LinearGradient
        colors={["#8E24AA", "#2196F3"]}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          width: size,
          height: size,
          borderRadius: sc(18),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Zap size={sc(33)} color="white" />
      </LinearGradient>

      <View
        style={{
          position: "absolute",
          width: sc(20),
          height: sc(20),
          borderRadius: sc(90),
          top: sc(-4),
          right: sc(-4),
        }}
        className="bg-[#22c55e]"
      />
    </View>
  );
};

export default IdeaPilotLogo;
