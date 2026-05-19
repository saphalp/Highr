import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export default function GoogleSignInButton({ onPress, loading = false }: Props) {
  return (
    <Pressable
      style={[styles.button, loading && styles.disabled]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.text}>
        {loading ? "Signing in..." : "Continue with Google"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});