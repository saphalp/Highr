import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
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

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={handleEditProfile}
        style={styles.editButton}
      >
        Edit Profile
      </Button>

      <Button
        mode="contained"
        onPress={() => {
          router.push("/recruiter/recruiter-job-postings");
        }}
        style={styles.editButton}
      >
        My Job Postings
      </Button>

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
