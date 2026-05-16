import ChatCard, { ChatPreview } from "@/components/ChatCard";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type UserRole = "applicant" | "employer" | "unknown";

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

async function getOrCreateMatchId(
  applicantId: string,
  employerId: string,
  jobPostingId: string | null,
): Promise<string | null> {
  let query = supabase
    .from("matches")
    .select("id")
    .eq("applicant_id", applicantId)
    .eq("employer_id", employerId);

  if (jobPostingId) query = query.eq("job_posting_id", jobPostingId);
  else query = query.is("job_posting_id", null);

  const { data: existing } = await query.maybeSingle();
  if (existing) return existing.id;

  const { data: created } = await supabase
    .from("matches")
    .insert({ applicant_id: applicantId, employer_id: employerId, job_posting_id: jobPostingId, status: "active" })
    .select("id")
    .single();

  return created?.id ?? null;
}

async function getOrCreateConversationId(matchId: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("match_id", matchId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created } = await supabase
    .from("conversations")
    .insert({ match_id: matchId })
    .select("id")
    .single();

  return created?.id ?? null;
}

export default function Matches() {
  const [role, setRole] = useState<UserRole>("unknown");
  const [matches, setMatches] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setMatches([]);
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

      const previews: ChatPreview[] = [];

      if (userRole === "applicant") {
        const { data: swipeMatches } = await supabase
          .from("swipes")
          .select("employer_id, job_posting_id")
          .eq("applicant_id", user.id)
          .eq("applicant_dir", "right")
          .eq("employer_dir", "right");

        for (const swipe of swipeMatches ?? []) {
          const matchId = await getOrCreateMatchId(
            user.id,
            swipe.employer_id,
            swipe.job_posting_id ?? null,
          );
          if (!matchId) continue;

          const conversationId = await getOrCreateConversationId(matchId);
          if (!conversationId) continue;

          const [{ data: employer }, { data: latestMsg }] = await Promise.all([
            supabase
              .from("Employer")
              .select("id, company_name, logo")
              .eq("id", swipe.employer_id)
              .single(),
            supabase
              .from("messages")
              .select("content, created_at")
              .eq("conversation_id", conversationId)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
          ]);

          if (!employer) continue;

          previews.push({
            id: employer.id,
            name: employer.company_name,
            profilePicture: employer.logo ?? null,
            lastMessage: latestMsg?.content ?? "You matched! Say hello 👋",
            timestamp: latestMsg?.created_at
              ? formatTimestamp(new Date(latestMsg.created_at))
              : "New",
            unread: false,
            conversationId,
          });
        }
      } else if (userRole === "employer") {
        const { data: swipeMatches } = await supabase
          .from("swipes")
          .select("applicant_id, job_posting_id")
          .eq("employer_id", user.id)
          .eq("applicant_dir", "right")
          .eq("employer_dir", "right");

        for (const swipe of swipeMatches ?? []) {
          const matchId = await getOrCreateMatchId(
            swipe.applicant_id,
            user.id,
            swipe.job_posting_id ?? null,
          );
          if (!matchId) continue;

          const conversationId = await getOrCreateConversationId(matchId);
          if (!conversationId) continue;

          const [{ data: applicant }, { data: latestMsg }] = await Promise.all([
            supabase
              .from("Applicant")
              .select("id, f_name, l_name, profile_pic")
              .eq("id", swipe.applicant_id)
              .single(),
            supabase
              .from("messages")
              .select("content, created_at")
              .eq("conversation_id", conversationId)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle(),
          ]);

          if (!applicant) continue;

          previews.push({
            id: applicant.id,
            name: `${applicant.f_name ?? ""} ${applicant.l_name ?? ""}`.trim(),
            profilePicture: applicant.profile_pic ?? null,
            lastMessage: latestMsg?.content ?? "You matched! Say hello 👋",
            timestamp: latestMsg?.created_at
              ? formatTimestamp(new Date(latestMsg.created_at))
              : "New",
            unread: false,
            conversationId,
          });
        }
      }

      setMatches(previews);
      setLoading(false);
    }

    loadMatches();
    }, []),
  );

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
          <Text style={styles.emptySubtext}>Keep swiping to find your match</Text>
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
                    name: chat.name,
                    profilePicture: chat.profilePicture ?? "",
                    conversationId: chat.conversationId,
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
});
