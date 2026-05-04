import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";

type Message = {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Chat() {
  const { id: matchId, name, profilePicture } = useLocalSearchParams<{
    id: string;
    name: string;
    profilePicture: string;
    lastMessage: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !matchId) return;
      setUserId(user.id);
      setUserRole(user.user_metadata?.role ?? "applicant");

      // Find or create a conversation for this match
      let { data: convo } = await supabase
        .from("conversations")
        .select("id")
        .eq("match_id", matchId)
        .maybeSingle();

      if (!convo) {
        const { data: newConvo } = await supabase
          .from("conversations")
          .insert({ match_id: matchId })
          .select("id")
          .single();
        convo = newConvo;
      }

      if (!convo) return;
      setConversationId(convo.id);

      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(
          data.map((m) => ({
            id: m.id,
            text: m.content,
            sent: m.sender_id === user.id,
            timestamp: formatTime(new Date(m.created_at)),
          }))
        );
      }

      subscription = supabase
        .channel(`messages:${convo.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${convo.id}` },
          (payload) => {
            const m = payload.new as { id: string; sender_id: string; content: string; created_at: string };
            setMessages((prev) => [
              ...prev,
              {
                id: m.id,
                text: m.content,
                sent: m.sender_id === user.id,
                timestamp: formatTime(new Date(m.created_at)),
              },
            ]);
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
          }
        )
        .subscribe();
    }

    init();
    return () => { subscription?.unsubscribe(); };
  }, [matchId]);

  async function sendMessage() {
    const text = inputText.trim();
    if (!text || !userId || !conversationId) return;
    setInputText("");

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      text,
      sent: true,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, optimistic]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      sender_role: userRole,
      content: text,
    });
  }

  const hasAvatar = !!profilePicture;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={Colors.text} />
        </TouchableOpacity>

        {hasAvatar ? (
          <Image source={{ uri: profilePicture }} style={styles.headerAvatar} />
        ) : (
          <View style={styles.headerAvatarFallback}>
            <Text style={styles.headerAvatarInitials}>{getInitials(name)}</Text>
          </View>
        )}

        <Text style={styles.headerName} numberOfLines={1}>
          {name}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[styles.bubbleWrapper, item.sent ? styles.alignRight : styles.alignLeft]}>
            <View style={[styles.bubble, item.sent ? styles.bubbleSent : styles.bubbleReceived]}>
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          submitBehavior="newline"
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const AVATAR_SIZE = 38;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 56,
    paddingBottom: 14,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    gap: 10,
  },
  backButton: {
    padding: 4,
  },
  headerAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  headerAvatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarInitials: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  headerName: {
    flex: 1,
    color: Colors.text,
    fontSize: 17,
    fontWeight: "600",
  },
  messageList: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  bubbleWrapper: {
    maxWidth: "75%",
    marginBottom: 10,
  },
  alignLeft: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  alignRight: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bubbleSent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  timestamp: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 3,
    marginHorizontal: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 32 : 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.5,
  },
});
