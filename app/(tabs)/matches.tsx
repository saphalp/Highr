import ChatCard, { ChatPreview } from "@/components/ChatCard";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Matches() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const userRole = user.user_metadata?.role ?? 'applicant';
    setRole(userRole);

    if (userRole === 'employer') {
      const { data: matches } = await supabase
        .from('matches')
        .select('id, created_at, applicant_id, job_posting_id')
        .eq('employer_id', user.id)
        .eq('status', 'matched')
        .order('created_at', { ascending: false });

      if (matches && matches.length > 0) {
        const applicantIds = [...new Set(matches.map((m) => m.applicant_id))];
        const { data: applicants } = await supabase
          .from('Applicant')
          .select('id, f_name, l_name')
          .in('id', applicantIds);

        const applicantMap = Object.fromEntries(
          (applicants ?? []).map((a) => [a.id, a])
        );

        setChats(
          matches.map((m) => {
            const applicant = applicantMap[m.applicant_id];
            const name = applicant
              ? `${applicant.f_name} ${applicant.l_name}`
              : 'Unknown Applicant';
            return {
              id: m.id,
              name,
              profilePicture: null,
              lastMessage: 'You matched! Start the conversation.',
              timestamp: new Date(m.created_at).toLocaleDateString(),
              unread: false,
            };
          })
        );
      }
    } else {
      const { data: matches } = await supabase
        .from('matches')
        .select('id, created_at, employer_id, job_posting_id')
        .eq('applicant_id', user.id)
        .eq('status', 'matched')
        .order('created_at', { ascending: false });

      if (matches && matches.length > 0) {
        const jobIds = [
          ...new Set(matches.map((m) => m.job_posting_id).filter(Boolean)),
        ];
        const { data: jobs } = await supabase
          .from('job_postings')
          .select('id, job_name, company_name')
          .in('id', jobIds);

        const jobMap = Object.fromEntries(
          (jobs ?? []).map((j) => [j.id, j])
        );

        setChats(
          matches.map((m) => {
            const job = jobMap[m.job_posting_id];
            const name = job ? `${job.job_name} at ${job.company_name}` : 'Unknown Job';
            return {
              id: m.id,
              name,
              profilePicture: null,
              lastMessage: job
                ? `Matched with ${job.company_name}! Say hello.`
                : 'You matched!',
              timestamp: new Date(m.created_at).toLocaleDateString(),
              unread: false,
            };
          })
        );
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Matches</Text>

      {loading ? (
        <Text style={styles.emptyText}>Loading...</Text>
      ) : chats.length === 0 ? (
        <Text style={styles.emptyText}>No matches yet. Keep swiping!</Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {chats.map((chat) => (
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

      {role === 'employer' && (
        <Button
          mode="outlined"
          style={styles.recruiterButton}
          onPress={() => router.push("/recruiter/recruiter-job-postings")}
        >
          My Job Postings
        </Button>
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
  list: {
    paddingBottom: 24,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 60,
  },
  recruiterButton: {
    marginVertical: 16,
    borderColor: Colors.outline,
  },
});
