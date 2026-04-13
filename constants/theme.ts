import { Platform } from "react-native";

export const Colors = {
  background: "#1A1A2E", // deep navy — main screen background
  surface: "#212140", // slightly lighter for cards/sheets
  inputBackground: "#2E2E3E", // muted dark for input fields
  text: "#FFFFFF", // primary text
  textMuted: "#888888", // secondary/placeholder text
  primary: "#6C63FF", // purple — primary buttons & accents
  secondary: "#4B45A1", // darker purple — secondary actions
  error: "#F2B8B5",
  outline: "#2A2A40", // borders/dividers
  icon: "#888888",
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
