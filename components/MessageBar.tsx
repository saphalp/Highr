import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

type MessageBarProps = {
  message: string;
  type?: "info" | "error";
};

export default function MessageBar({ message, type = "info" }: MessageBarProps) {
  if (!message) return null;
  return (
    <View style={[styles.container, type === "error" ? styles.error : styles.info]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  info: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  error: {
    backgroundColor: Colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  text: {
    color: Colors.text,
    fontSize: 13,
  },
});
