import { Colors } from "@/constants/theme";
import { SkillEntry, SkillLevel } from "@/types/applicant";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

type Props = {
  entries: SkillEntry[];
  onAdd: (entry: SkillEntry) => void;
  onRemove: (index: number) => void;
};

const LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

const LEVEL_COLORS: Record<SkillLevel, string> = {
  Beginner: "#4A90D9",
  Intermediate: "#8B6FD4",
  Advanced: "#D4846F",
  Expert: "#6FD49A",
};

export default function ApplicantSkills({ entries, onAdd, onRemove }: Props) {
  const [skillName, setSkillName] = useState("");
  const [level, setLevel] = useState<SkillLevel>("Intermediate");

  const handleAdd = () => {
    const entry: SkillEntry = { name: skillName.trim(), level };
    console.log("Skill entry added:", entry);
    onAdd(entry);
    setSkillName("");
    setLevel("Intermediate");
  };

  const isValid = skillName.trim() !== "";

  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Skills
      </Text>

      {entries.length > 0 && (
        <View style={styles.entriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {entries.map((entry, index) => (
              <View
                key={index}
                style={[styles.chip, { borderColor: LEVEL_COLORS[entry.level] }]}
              >
                <View style={styles.chipContent}>
                  <Text style={styles.chipName}>{entry.name}</Text>
                  <Text style={[styles.chipLevel, { color: LEVEL_COLORS[entry.level] }]}>
                    {entry.level}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => onRemove(index)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={styles.chipRemove}
                >
                  <Ionicons name="close" size={14} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <TextInput
        label="Skill name"
        value={skillName}
        onChangeText={setSkillName}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.levelLabel}>Proficiency</Text>
      <View style={styles.levelRow}>
        {LEVELS.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[
              styles.levelChip,
              level === lvl && {
                backgroundColor: LEVEL_COLORS[lvl] + "22",
                borderColor: LEVEL_COLORS[lvl],
              },
            ]}
            onPress={() => setLevel(lvl)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.levelChipText,
                level === lvl && { color: LEVEL_COLORS[lvl] },
              ]}
            >
              {lvl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        mode="outlined"
        onPress={handleAdd}
        disabled={!isValid}
        style={styles.addButton}
        contentStyle={styles.addButtonContent}
        labelStyle={styles.addButtonLabel}
        icon="plus"
      >
        Add Skill
      </Button>
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
  entriesContainer: {
    marginBottom: 20,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    gap: 6,
  },
  chipContent: {
    alignItems: "center",
    gap: 1,
  },
  chipName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  chipLevel: {
    fontSize: 10,
    fontWeight: "500",
  },
  chipRemove: {
    marginLeft: 2,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.inputBackground,
  },
  levelLabel: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  levelRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  levelChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.inputBackground,
  },
  levelChipText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  addButton: {
    borderColor: Colors.secondary,
    borderRadius: 8,
  },
  addButtonContent: {
    paddingVertical: 4,
  },
  addButtonLabel: {
    color: Colors.secondary,
    fontSize: 15,
  },
});
