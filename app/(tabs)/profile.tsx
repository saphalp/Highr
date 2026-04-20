import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Profile() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => router.push("/profile-setup")}
        style={styles.editButton}
      >
        Edit Profile
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
});
