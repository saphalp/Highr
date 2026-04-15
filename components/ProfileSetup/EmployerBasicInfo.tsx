import { Colors } from "@/constants/theme";
import { EmployerProfile } from "@/types/employer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import UploadProfileImage from "./UploadProfileImage";

type Props = {
  data: Pick<
    EmployerProfile,
    "profileImageUri" | "contactName" | "contactTitle" | "contactPhone" | "companyName"
  >;
  onChange: (fields: Partial<EmployerProfile>) => void;
};

export default function EmployerBasicInfo({ data, onChange }: Props) {
  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Basic Info
      </Text>
      <UploadProfileImage
        uri={data.profileImageUri}
        onChangeUri={(uri) => onChange({ profileImageUri: uri })}
      />

      <Text style={styles.sectionLabel}>Your Details</Text>
      <TextInput
        label="Your Name"
        value={data.contactName}
        onChangeText={(v) => onChange({ contactName: v })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Your Title (e.g. HR Manager, Founder)"
        value={data.contactTitle}
        onChangeText={(v) => onChange({ contactTitle: v })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Phone Number"
        value={data.contactPhone}
        onChangeText={(v) => onChange({ contactPhone: v })}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.sectionLabel}>Company</Text>
      <TextInput
        label="Company Name"
        value={data.companyName}
        onChangeText={(v) => onChange({ companyName: v })}
        mode="outlined"
        style={styles.input}
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
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  input: {
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
  },
});
