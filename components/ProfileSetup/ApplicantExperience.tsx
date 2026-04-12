import { Colors } from "@/constants/theme";
import { ExperienceEntry } from "@/types/applicant";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";

type Props = {
  entries: ExperienceEntry[];
  onAdd: (entry: ExperienceEntry) => void;
  onRemove: (index: number) => void;
};

export default function ApplicantExperience({ entries, onAdd, onRemove }: Props) {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    const entry: ExperienceEntry = {
      company,
      title,
      location,
      startDate,
      endDate: current ? "Present" : endDate,
      current,
      description,
    };
    console.log("Experience entry added:", entry);
    onAdd(entry);
    setCompany("");
    setTitle("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setDescription("");
  };

  const isValid =
    company.trim() !== "" &&
    title.trim() !== "" &&
    startDate.trim() !== "" &&
    (current || endDate.trim() !== "");

  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Experience
      </Text>

      {entries.length > 0 && (
        <View style={styles.entriesContainer}>
          {entries.map((entry, index) => (
            <View key={index} style={styles.entryCard}>
              <View style={styles.entryCardContent}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entrySubtitle}>{entry.company}</Text>
                {entry.location !== "" && (
                  <Text style={styles.entryMeta}>{entry.location}</Text>
                )}
                <Text style={styles.entryMeta}>
                  {entry.startDate} – {entry.endDate}
                </Text>
                {entry.description !== "" && (
                  <Text style={styles.entryDescription} numberOfLines={2}>
                    {entry.description}
                  </Text>
                )}
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
          label="Company"
          value={company}
          onChangeText={setCompany}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Job Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Location (optional)"
          value={location}
          onChangeText={setLocation}
          mode="outlined"
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInput
            label="Start (MM/YYYY)"
            value={startDate}
            onChangeText={setStartDate}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label="End (MM/YYYY)"
            value={endDate}
            onChangeText={setEndDate}
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            disabled={current}
          />
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Currently working here</Text>
          <Switch value={current} onValueChange={setCurrent} color={Colors.secondary} />
        </View>
        <TextInput
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea]}
        />
        <Button
          mode="outlined"
          onPress={handleAdd}
          disabled={!isValid}
          style={styles.addButton}
          contentStyle={styles.addButtonContent}
          labelStyle={styles.addButtonLabel}
          icon="plus"
        >
          Add Experience
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
  entryDescription: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  formSection: {},
  input: {
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
  },
  textArea: {
    minHeight: 80,
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
