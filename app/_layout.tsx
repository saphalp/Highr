import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";

//Colors hex values can be edited from /constants/theme.ts
// primary — buttons, FABs, active states
// secondary — chips, secondary actions
// background — screen background
// surface — cards, modals, sheets
// error — input errors, destructive actions
// onPrimary — text/icons on top of primary color
// outline — borders, dividers
const appTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.primary,
    onPrimary: Colors.text,
    secondary: Colors.secondary,
    onSecondary: Colors.text,
    background: Colors.background,
    surface: Colors.surface,
    onBackground: Colors.text,
    onSurface: Colors.text,
    onSurfaceVariant: Colors.textMuted,
    error: Colors.error,
    outline: Colors.outline,
  },
};

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(tabs)/discover");
      } else {
        router.replace("/login");
      }
    });
  }, []);

  return (
    <PaperProvider theme={appTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}