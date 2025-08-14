import { StyleSheet } from "react-native";
import { sc, ms, vs } from "./responsive";

export const styles = StyleSheet.create({
  overView: {
    flexGrow: 1,
    padding: sc(25),
    marginBottom: vs(25),
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: sc(12),
    width: "100%",
    borderWidth: ms(1.5),
    borderRadius: ms(7),
  },
  centerContent: {
    padding: sc(5),
  },
  title: {
    fontSize: ms(32),
    fontWeight: "800",
    marginTop: vs(10),
  },
  caption: {
    fontSize: sc(11),
    fontWeight: "400",
    marginTop: vs(5),
    marginBottom: vs(22),
  },
  shadow: {
    backgroundColor: "#fff",
    elevation: 15,
  },
});
