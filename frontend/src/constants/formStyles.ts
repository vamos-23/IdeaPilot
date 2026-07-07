import { StyleSheet } from "react-native";
import { sc, ms, vs } from "./responsive";
export const styles = StyleSheet.create({
  overView: {
    flexGrow: 1,
    padding: sc(23),
    marginBottom: vs(25),
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: sc(12),
    width: "100%",
    borderWidth: ms(1.5),
    borderRadius: ms(18),
  },
  centerContent: {
    padding: sc(5),
  },
  title: {
    fontSize: ms(32),
    fontWeight: "600",
    marginTop: vs(10),
  },
  caption: {
    fontSize: sc(11),
    marginTop: vs(5),
    marginBottom: vs(22),
  },
});