import ChatCard, { ChatPreview } from "@/components/ChatCard";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type UserRole = "applicant" | "employer" | "unknown";

export default function Matches() {
  const [role, setRole] = useState<UserRole>("unknown");
  const [matches, setMatches] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const userRole: UserRole = user.user_metadata?.role ?? "unknown";
      setRole(userRole);

      if (userRole === "applicant") {
        const { data: swipeMatches } = await supabase
          .from("swipes")
          .select("employer_id, job_posting_id")
          .eq("applicant_id", user.id)
          .eq("applicant_dir", "right")
          .eq("employer_dir", "right");

        if (swipeMatches?.length) {
          const employerIds = swipeMatches.map((s) => s.employer_id);
          const { data: employers } = await supabase
            .from("Employer")
            .select("id, company_name, logo")
            .in("id", employerIds);

          setMatches(
            (employers ?? []).map((emp) => ({
              id: emp.id,
              name: emp.company_name,
              profilePicture: emp.logo ?? null,
              lastMessage: "You matched! Say hello 👋",
              timestamp: "New",
              unread: true,
            })),
          );
        }
      } else if (userRole === "employer") {
        const { data: swipeMatches } = await supabase
          .from("swipes")
          .select("applicant_id")
          .eq("employer_id", user.id)
          .eq("applicant_dir", "right")
          .eq("employer_dir", "right");

        if (swipeMatches?.length) {
          const applicantIds = swipeMatches.map((s) => s.applicant_id);
          const { data: applicants } = await supabase
            .from("Applicant")
            .select("id, f_name, l_name, profile_pic")
            .in("id", applicantIds);

          setMatches(
            (applicants ?? []).map((app) => ({
              id: app.id,
              name: `${app.f_name ?? ""} ${app.l_name ?? ""}`.trim(),
              profilePicture: app.profile_pic ?? null,
              lastMessage: "You matched! Say hello 👋",
              timestamp: "New",
              unread: true,
            })),
          );
        }
      }

      setLoading(false);
    }
    loadMatches();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Matches</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No matches yet</Text>
          <Text style={styles.emptySubtext}>
            Keep swiping to find your match
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {matches.map((chat) => (
            <ChatCard
              key={chat.id}
              chat={chat}
              onPress={() =>
                router.push({
                  pathname: "/chat",
                  params: {
                    id: chat.id,
                    name: chat.name,
                    profilePicture: chat.profilePicture ?? "",
                    lastMessage: chat.lastMessage,
                  },
                })
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  list: {
    paddingBottom: 24,
  },
  recruiterButton: {
    marginVertical: 16,
    borderColor: Colors.outline,
  },
});
