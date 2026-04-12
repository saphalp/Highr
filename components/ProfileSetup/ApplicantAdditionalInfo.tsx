import { Colors } from "@/constants/theme";
import { ApplicantProfile } from "@/types/applicant";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  data: Pick<ApplicantProfile, "bio" | "linkedin" | "portfolio" | "github">;
  onChange: (fields: Partial<ApplicantProfile>) => void;
};

export default function ApplicantAdditionalInfo({ data, onChange }: Props) {
  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Additional Info
      </Text>

      <TextInput
        label="Bio / Summary"
        value={data.bio}
        onChangeText={(v) => onChange({ bio: v })}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
        placeholder="Tell employers about yourself, your goals, and what makes you unique..."
      />
      <TextInput
        label="LinkedIn URL"
        value={data.linkedin}
        onChangeText={(v) => onChange({ linkedin: v })}
        mode="outlined"
        keyboardType="url"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="linkedin" color={Colors.textMuted} />}
      />
      <TextInput
        label="Portfolio / Website"
        value={data.portfolio}
        onChangeText={(v) => onChange({ portfolio: v })}
        mode="outlined"
        keyboardType="url"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="web" color={Colors.textMuted} />}
      />
      <TextInput
        label="GitHub URL"
        value={data.github}
        onChangeText={(v) => onChange({ github: v })}
        mode="outlined"
        keyboardType="url"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="github" color={Colors.textMuted} />}
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
  input: {
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
  },
  textArea: {
    minHeight: 100,
  },
});
