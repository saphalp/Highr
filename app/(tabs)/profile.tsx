import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function Profile() {
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("there");

  useEffect(() => {
    const getUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setRole(user?.user_metadata?.role || null);
    };

    getUserRole();
  }, []);

  const isEmployer = role === "employer";
  const isApplicant = role === "applicant";

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Logout error:", error.message);
      return;
    }

    router.replace("/login");
  };

  const handleEditProfile = () => {
    if (isApplicant) {
      router.push("/applicant/edit-profile-applicant");
      return;
    }

    if (isEmployer) {
      router.push("/recruiter/edit-profile-recruiter");
      return;
    }

    router.push("/role-selection");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting}, {displayName}</Text>
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
        onPress={handleEditProfile}
        style={styles.editButton}
      >
        Edit Profile
      </Button>

      {isEmployer && (
        <Button
          mode="contained"
          onPress={() => router.push("/recruiter/recruiter-job-postings")}
          style={styles.editButton}
        >
          My Job Postings
        </Button>
      )}

      {isApplicant && (
        <Button
          mode="contained"
          onPress={() => router.push("/preview-card" as any)}
          style={styles.editButton}
        >
          Preview Card
        </Button>
      )}

      <Button
        mode="outlined"
        onPress={() => router.push("/terms-and-conditions")}
        style={styles.termsButton}
      >
        Terms and Conditions
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
  termsButton: {
    width: "100%",
    borderRadius: 8,
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
});
