import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function Profile() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleEditProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const isApplicant = user?.user_metadata?.role !== "employer";
    router.push(`/profile-setup?isApplicant=${isApplicant}`);
  };

  const [role, setRole] = useState<string | null>(null);

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



  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          if (isApplicant) {
            router.push("/applicant/edit-profile-applicant");
          } else if (isEmployer) {
            router.push("/recruiter/edit-profile-recruiter");
          }
        }}
        style={styles.editButton}
      >
        Edit Profile
      </Button>

    {isEmployer && (
      <Button
        mode="contained"
        onPress={() => {
          router.push("/recruiter/recruiter-job-postings");
        }}
        style={styles.editButton}
      >
        My Job Postings
      </Button>
    )}

    {isApplicant && (
      <Button
        mode="contained"
        onPress={() => {
          router.push("/preview-card" as any);
        }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  editButton: {
    width: "100%",
    borderRadius: 8,
  },
  logoutButton: {
    width: "100%",
    borderRadius: 8,
    borderColor: Colors.error,
  },
  logoutLabel: {
    color: Colors.error,
  },
  termsButton: {
    width: "100%",
    borderRadius: 8,
  },
});
