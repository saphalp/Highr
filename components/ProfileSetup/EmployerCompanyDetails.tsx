import { Colors } from "@/constants/theme";
import { CompanySize, EmployerProfile } from "@/types/employer";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  data: Pick<
    EmployerProfile,
    "industry" | "companySize" | "foundedYear" | "website" | "about"
  >;
  onChange: (fields: Partial<EmployerProfile>) => void;
};

const SIZES: CompanySize[] = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];

export default function EmployerCompanyDetails({ data, onChange }: Props) {
  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Company Details
      </Text>

      <TextInput
        label="Industry (e.g. Technology, Finance)"
        value={data.industry}
        onChangeText={(v) => onChange({ industry: v })}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.fieldLabel}>Company Size</Text>
      <View style={styles.chipRow}>
        {SIZES.map((size) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.chip,
              data.companySize === size && styles.chipSelected,
            ]}
            onPress={() => onChange({ companySize: size })}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                data.companySize === size && styles.chipTextSelected,
              ]}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        label="Website (optional)"
        value={data.website}
        onChangeText={(v) => onChange({ website: v })}
        mode="outlined"
        keyboardType="url"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="web" color={Colors.textMuted} />}
      />
      <TextInput
        label="About the Company"
        value={data.about}
        onChangeText={(v) => onChange({ about: v })}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
        placeholder="What does your company do? What's your mission?"
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
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.inputBackground,
  },
  chipSelected: {
    backgroundColor: Colors.primary + "22",
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: Colors.primary,
  },
});
