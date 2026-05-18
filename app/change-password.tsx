import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill out all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Invalid password", "Your new password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password mismatch", "Your new passwords do not match.");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email;

    if (!email) {
      Alert.alert("Error", "Could not find your account email.");
      setSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) {
      Alert.alert("Incorrect password", "Your current password is incorrect.");
      setSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setSubmitting(false);

    if (updateError) {
      Alert.alert("Error", updateError.message);
      return;
    }

    Alert.alert("Success", "Your password has been updated.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.title}>Change Password</Text>

      <TextInput
        label="Current Password"
        mode="outlined"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="New Password"
        mode="outlined"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        label="Confirm New Password"
        mode="outlined"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>

        <Button
          mode="contained"
          onPress={handleChangePassword}
          loading={submitting}
          disabled={submitting}
          style={styles.saveButton}
        >
          Save
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: Colors.inputBackground,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
});