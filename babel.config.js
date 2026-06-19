module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-worklets/plugin",
      ["@babel/plugin-transform-class-properties", { loose: true }],
      ["@babel/plugin-transform-private-methods", { loose: true }],
      ["@babel/plugin-transform-private-property-in-object", { loose: true }],
       //"react-native-reanimated/plugin"
    ],
  };
};
// module.exports = function (api) {
//   api.cache(true);

//   return {
//     presets: [
//       [
//         "babel-preset-expo",
//         {
//           jsxImportSource: "nativewind",
//         },
//       ],
//     ],
//     plugins: [
//       "nativewind/babel",
//       "react-native-worklets/plugin",
//       // "react-native-reanimated/plugin"
//     ],
//   };
// };
