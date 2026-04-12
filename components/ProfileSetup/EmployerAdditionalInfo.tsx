import { Colors } from "@/constants/theme";
import { EmployerProfile } from "@/types/employer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  data: Pick<EmployerProfile, "linkedin" | "twitter" | "culture">;
  onChange: (fields: Partial<EmployerProfile>) => void;
};

export default function EmployerAdditionalInfo({ data, onChange }: Props) {
  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Additional Info
      </Text>
      <TextInput
        label="LinkedIn Company Page (optional)"
        value={data.linkedin}
        onChangeText={(v) => onChange({ linkedin: v })}
        mode="outlined"
        keyboardType="url"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="linkedin" color={Colors.textMuted} />}
      />
      <TextInput
        label="Culture & Perks"
        value={data.culture}
        onChangeText={(v) => onChange({ culture: v })}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
        placeholder="Describe your team culture, benefits, perks, and what makes working here great..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
  },
  textArea: {
    minHeight: 100,
  },
});
