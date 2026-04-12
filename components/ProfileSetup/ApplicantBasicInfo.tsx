import { Colors } from "@/constants/theme";
import { ApplicantProfile } from "@/types/applicant";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  data: Pick<ApplicantProfile, "fName" | "lName" | "phone" | "address">;
  onChange: (fields: Partial<ApplicantProfile>) => void;
};

export default function ApplicantBasicInfo({ data, onChange }: Props) {
  return (
    <View>
      <Text variant="headlineMedium" style={styles.header}>
        Basic Info
      </Text>
      <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.7}>
        <View style={styles.avatar}>
          <Ionicons name="camera-outline" size={32} color={Colors.textMuted} />
        </View>
        <Text style={styles.avatarLabel}>Upload Profile Picture</Text>
      </TouchableOpacity>

      <TextInput
        label="First Name"
        value={data.fName}
        onChangeText={(v) => onChange({ fName: v })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={data.lName}
        onChangeText={(v) => onChange({ lName: v })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Phone Number"
        value={data.phone}
        onChangeText={(v) => onChange({ phone: v })}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        label="Address"
        value={data.address}
        onChangeText={(v) => onChange({ address: v })}
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
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
  avatarLabel: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  input: {
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
  },
});
