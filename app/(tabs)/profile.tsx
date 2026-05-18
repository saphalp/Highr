import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function Profile() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("there");

  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setRole(user?.user_metadata?.role || null);
      setEmail(user?.email || "");
      setDisplayName(
        user?.user_metadata?.first_name ||
          user?.user_metadata?.f_name ||
          user?.email?.split("@")[0] ||
          "there",
      );
    };

    getUserRole();
  }, []);

  const isEmployer = role === "employer";
  const isApplicant = role === "applicant";

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const roleLabel = isEmployer
    ? "Recruiter"
    : isApplicant
      ? "Applicant"
      : "User";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {greeting}, {displayName}
        </Text>
      </View>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Account Overview</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email || "No email found"}</Text>

          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.value}>{roleLabel}</Text>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Profile</Text>

      <Button
        mode="contained"
        onPress={() => {
          if (isApplicant) {
            router.push("/applicant/edit-profile-applicant");
          } else if (isEmployer) {
            router.push("/recruiter/edit-profile-recruiter");
          }
        }}
        style={styles.actionButton}
      >
        Edit Profile
      </Button>

      {isEmployer && (
        <Button
          mode="contained"
          onPress={() => router.push("/recruiter/recruiter-job-postings")}
          style={styles.actionButton}
        >
          My Job Postings
        </Button>
      )}

      {isApplicant && (
        <Button
          mode="contained"
          onPress={() => router.push("/preview-card" as any)}
          style={styles.actionButton}
        >
          Preview Card
        </Button>
      )}

      <Text style={styles.sectionTitle}>Account</Text>

      <Button
        mode="outlined"
        onPress={() => router.push("/terms-and-conditions")}
        style={styles.actionButton}
      >
        Terms and Conditions
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.push("/change-password" as any)}
        style={styles.passwordButton}
        labelStyle={styles.passwordLabel}
      >
        Change Password
      </Button>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.logoutLabel}
      >
        Log Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 12,
  },
  roleChip: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surface,
  },
  roleChipText: {
    color: Colors.text,
    fontWeight: "bold",
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 28,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
  value: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 2,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 8,
  },
  actionButton: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 12,
  },
  logoutButton: {
    width: "100%",
    borderRadius: 8,
    borderColor: Colors.error,
    marginTop: 4,
  },
  logoutLabel: {
    color: Colors.error,
  },
  passwordButton: {
    width: "100%",
    borderRadius: 8,
    borderColor: "#E6A23C",
    marginTop: 4,
    marginBottom: 12,
  },
  passwordLabel: {
    color: "#E6A23C",
  },
});
