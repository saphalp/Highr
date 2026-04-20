import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type UserInfo = {
  email: string;
  role: string;
};

export default function Discover() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserInfo({
          email: user.email ?? "",
          role: user.user_metadata?.role ?? "unknown",
        });
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {userInfo && (
        <View style={styles.infoCard}>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.email}>{userInfo.email}</Text>
          <Text style={styles.role}>
            {userInfo.role === "employer" ? "Employer" : "Job Seeker"}
          </Text>
        </View>
      )}
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
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: "100%",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  greeting: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  email: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});