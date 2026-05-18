import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Role = "applicant" | "employer" | null;

export default function RoleSelectionScreen() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [confirming, setConfirming] = useState(false);

  const handleRoleConfirm = async () => {
    if (!selectedRole) return;

    try {
      setConfirming(true);

      const { error } = await supabase.auth.updateUser({
        data: { role: selectedRole },
      });

      if (error) {
        console.error("Failed to save role:", error.message);
        return;
      }

      if (selectedRole === "applicant") {
        router.replace("/profile-setup?isApplicant=true");
        return;
      }

      if (selectedRole === "employer") {
        router.replace("/profile-setup?isApplicant=false");
        return;
      }
    } finally {
      setConfirming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Highr!</Text>
        <Text style={styles.subtitle}>How will you be using the app?</Text>

        <Pressable
          style={[
            styles.card,
            selectedRole === "applicant" && styles.cardSelected,
          ]}
          onPress={() => setSelectedRole("applicant")}
        >
          <Text style={styles.cardIcon}>🧑‍💼</Text>

          <View style={styles.cardText}>
            <Text
              style={[
                styles.cardTitle,
                selectedRole === "applicant" && styles.cardTitleSelected,
              ]}
            >
              Job Seeker
            </Text>

            <Text style={styles.cardDesc}>
              Browse jobs, apply to positions, and manage your career.
            </Text>
          </View>

          {selectedRole === "applicant" && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.card,
            selectedRole === "employer" && styles.cardSelected,
          ]}
          onPress={() => setSelectedRole("employer")}
        >
          <Text style={styles.cardIcon}>🏢</Text>

          <View style={styles.cardText}>
            <Text
              style={[
                styles.cardTitle,
                selectedRole === "employer" && styles.cardTitleSelected,
              ]}
            >
              Recruiter
            </Text>

            <Text style={styles.cardDesc}>
              Post jobs, review applicants, and grow your team.
            </Text>
          </View>

          {selectedRole === "employer" && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </Pressable>

        <Button
          mode="contained"
          onPress={handleRoleConfirm}
          disabled={!selectedRole || confirming}
          loading={confirming}
          style={[
            styles.continueBtn,
            !selectedRole && styles.continueBtnDisabled,
          ]}
          labelStyle={styles.continueBtnLabel}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 36,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.outline,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardTitleSelected: {
    color: Colors.primary,
  },
  cardDesc: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  continueBtn: {
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary,
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueBtnLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
});