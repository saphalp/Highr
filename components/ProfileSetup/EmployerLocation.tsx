import { Colors } from "@/constants/theme";
import { EmployerProfile, WorkType } from "@/types/employer";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  data: Pick<EmployerProfile, "city" | "country" | "workTypes">;
  onChange: (fields: Partial<EmployerProfile>) => void;
};

const WORK_TYPES: WorkType[] = ["Remote", "Hybrid", "On-site"];

const WORK_TYPE_COLORS: Record<WorkType, string> = {
  Remote: "#6FD49A",
  Hybrid: "#6C63FF",
  "On-site": "#D4846F",
};

export default function EmployerLocation({ data, onChange }: Props) {
  const toggleWorkType = (type: WorkType) => {
    const current = data.workTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ workTypes: updated });
  };

  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Location & Work Style
      </Text>

      <TextInput
        label="City"
        value={data.city}
        onChangeText={(v) => onChange({ city: v })}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="map-marker-outline" color={Colors.textMuted} />}
      />
      <TextInput
        label="Country"
        value={data.country}
        onChangeText={(v) => onChange({ country: v })}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="earth" color={Colors.textMuted} />}
      />

      <Text style={styles.fieldLabel}>Work Type (select all that apply)</Text>
      <View style={styles.chipRow}>
        {WORK_TYPES.map((type) => {
          const selected = data.workTypes.includes(type);
          const color = WORK_TYPE_COLORS[type];
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                selected && {
                  backgroundColor: color + "22",
                  borderColor: color,
                },
              ]}
              onPress={() => toggleWorkType(type)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  selected && { color },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {data.workTypes.length === 0 && (
        <Text style={styles.hint}>Select at least one work type.</Text>
      )}
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
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  chipRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.inputBackground,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
  },
  hint: {
    color: Colors.textMuted,
    fontSize: 12,
    paddingHorizontal: 4,
    marginTop: 4,
  },
});
