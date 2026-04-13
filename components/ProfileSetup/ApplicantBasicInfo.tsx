import { Colors } from "@/constants/theme";
import { ApplicantProfile } from "@/types/applicant";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import UploadProfileImage from "./UploadProfileImage";

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
      <UploadProfileImage />
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
  input: {
    marginBottom: 12,
    backgroundColor: Colors.inputBackground,
  },
});
