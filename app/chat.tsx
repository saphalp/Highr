import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
  const { name, profilePicture, conversationId } = useLocalSearchParams<{
    name: string;
    profilePicture: string;
    conversationId: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("applicant");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    let userId: string;

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      userId = user.id;
      setCurrentUserId(user.id);
      setCurrentUserRole(user.user_metadata?.role ?? "applicant");

      const { data: rows } = await supabase
        .from("messages")
        .select("id, content, sender_id, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (rows) {
        setMessages(
          rows.map((row) => ({
            id: row.id,
            text: row.content,
            sent: row.sender_id === user.id,
            timestamp: formatTime(new Date(row.created_at)),
          })),
        );
      }
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 50);
    }

    init();

    const subscription = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            content: string;
            sender_id: string;
            created_at: string;
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [
              ...prev,
              {
                id: row.id,
                text: row.content,
                sent: row.sender_id === userId,
                timestamp: formatTime(new Date(row.created_at)),
              },
            ];
          });
          setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [conversationId]);

  async function sendMessage() {
    const text = inputText.trim();
    if (!text || !currentUserId || !conversationId) return;

    setInputText("");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        sender_role: currentUserRole,
        content: text,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Failed to send message:", error.message);
      return;
    }

    if (data) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [
          ...prev,
          {
            id: data.id,
            text,
            sent: true,
            timestamp: formatTime(new Date(data.created_at)),
          },
        ];
      });
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }

    supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId)
      .then(() => {});
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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messageList,
            messages.length === 0 && styles.messageListEmpty,
          ]}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubbleWrapper,
                item.sent ? styles.alignRight : styles.alignLeft,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  item.sent ? styles.bubbleSent : styles.bubbleReceived,
                ]}
              >
                <Text style={styles.bubbleText}>{item.text}</Text>
              </View>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  messageList: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  messageListEmpty: {
    flex: 1,
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
