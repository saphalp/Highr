import ChatCard, { ChatPreview } from "@/components/ChatCard";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

const DUMMY_CHATS: ChatPreview[] = [
  {
    id: "1",
    name: "Jagat Bhattarai",
    profilePicture: "https://i.pravatar.cc/150?img=47",
    lastMessage: "Looking forward to hearing more about your experience!",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: "2",
    name: "Sandip Thapa",
    profilePicture: "https://i.pravatar.cc/150?img=12",
    lastMessage: "We'd love to schedule a call this week if you're available.",
    timestamp: "1h ago",
    unread: true,
  },
  {
    id: "3",
    name: "Jack Revelett",
    profilePicture: null,
    lastMessage: "Thanks for connecting! Your portfolio looks impressive.",
    timestamp: "Yesterday",
    unread: false,
  },
];

export default function Matches() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Matches</Text>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {DUMMY_CHATS.map((chat) => (
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

      <Button
        mode="outlined"
        style={styles.recruiterButton}
        onPress={() => router.push("/recruiter/recruiter-job-postings")}
      >
        My Job Postings
      </Button>
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
  recruiterButton: {
    marginVertical: 16,
    borderColor: Colors.outline,
  },
});
