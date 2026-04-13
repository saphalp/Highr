import { Colors } from "@/constants/theme";
import { EmployerProfile } from "@/types/employer";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  data: Pick<
    EmployerProfile,
    "contactName" | "contactTitle" | "contactPhone" | "companyName"
  >;
  onChange: (fields: Partial<EmployerProfile>) => void;
};

export default function EmployerBasicInfo({ data, onChange }: Props) {
  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Basic Info
      </Text>

      <TouchableOpacity style={styles.logoContainer} activeOpacity={0.7}>
        <View style={styles.logo}>
          <Ionicons name="camera-outline" size={32} color={Colors.textMuted} />
        </View>
        <Text style={styles.logoLabel}>Upload Profile Photo</Text>
      </TouchableOpacity>

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
  logoContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.inputBackground,
    borderWidth: 2,
    borderColor: Colors.outline,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  logoLabel: {
    color: Colors.textMuted,
    fontSize: 13,
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
