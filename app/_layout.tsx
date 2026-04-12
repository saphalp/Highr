//entry point for the app

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

//Colors hex values can be editied from /constants/theme.ts
// primary — buttons, FABs, active states
// secondary — chips, secondary actions
// background — screen background
// surface — cards, modals, sheets
// error — input errors, destructive actions
// onPrimary — text/icons on top of primary color
// outline — borders, dividers
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.tint,
    secondary: Colors.light.icon,
    background: Colors.light.background,
    surface: Colors.light.background,
    error: "#B3261E",
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.tint,
    secondary: Colors.dark.icon,
    background: Colors.dark.background,
    surface: Colors.dark.background,
    error: "#F2B8B5",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
