import { Colors } from "@/constants/theme";
import { EducationEntry } from "@/types/applicant";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";

type Props = {
  entries: EducationEntry[];
  onAdd: (entry: EducationEntry) => void;
  onRemove: (index: number) => void;
};

export default function ApplicantEducation({ entries, onAdd, onRemove }: Props) {
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [current, setCurrent] = useState(false);

  const handleAdd = () => {
    const entry: EducationEntry = {
      institution,
      degree,
      field,
      startYear,
      endYear: current ? "Present" : endYear,
      current,
    };
    console.log("Education entry added:", entry);
    onAdd(entry);
    setInstitution("");
    setDegree("");
    setField("");
    setStartYear("");
    setEndYear("");
    setCurrent(false);
  };

  const isValid =
    institution.trim() !== "" &&
    degree.trim() !== "" &&
    startYear.trim() !== "" &&
    (current || endYear.trim() !== "");

  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Education
      </Text>

      {entries.length > 0 && (
        <View style={styles.entriesContainer}>
          {entries.map((entry, index) => (
            <View key={index} style={styles.entryCard}>
              <View style={styles.entryCardContent}>
                <Text style={styles.entryTitle}>{entry.degree}</Text>
                <Text style={styles.entrySubtitle}>{entry.institution}</Text>
                {entry.field !== "" && (
                  <Text style={styles.entryMeta}>{entry.field}</Text>
                )}
                <Text style={styles.entryMeta}>
                  {entry.startYear} – {entry.endYear}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onRemove(index)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.formSection}>
        <TextInput
          label="Institution"
          value={institution}
          onChangeText={setInstitution}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Degree (e.g. Bachelor of Science)"
          value={degree}
          onChangeText={setDegree}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Field of Study (optional)"
          value={field}
          onChangeText={setField}
          mode="outlined"
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInput
            label="Start Year"
            value={startYear}
            onChangeText={setStartYear}
            mode="outlined"
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label="End Year"
            value={endYear}
            onChangeText={setEndYear}
            mode="outlined"
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
            disabled={current}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Currently studying here</Text>
          <Switch value={current} onValueChange={setCurrent} color={Colors.secondary} />
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
          Add Education
        </Button>
      </View>
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
    gap: 10,
  },
  entryCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  entryCardContent: {
    flex: 1,
    marginRight: 8,
    gap: 2,
  },
  entryTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  entrySubtitle: {
    color: Colors.secondary,
    fontSize: 13,
    fontWeight: "500",
  },
  entryMeta: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  formSection: {},
  input: {
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  switchLabel: {
    color: Colors.textMuted,
    fontSize: 14,
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
