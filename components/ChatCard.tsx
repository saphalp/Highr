import { Colors } from "@/constants/theme";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export type ChatPreview = {
  id: string;
  name: string;
  profilePicture: string | null;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
  conversationId: string;
};

type Props = {
  chat: ChatPreview;
  onPress?: () => void;
};

function AvatarFallback({ name }: { name: string }) {
  const initials = (name || "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarInitials}>{initials}</Text>
    </View>
  );
}

export default function ChatCard({ chat, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {chat.profilePicture ? (
          <Image source={{ uri: chat.profilePicture }} style={styles.avatar} />
        ) : (
          <AvatarFallback name={chat.name} />
        )}
        {chat.unread && <View style={styles.unreadBadge} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.timestamp}>{chat.timestamp}</Text>
        </View>
        <Text
          style={[styles.lastMessage, chat.unread && styles.lastMessageUnread]}
          numberOfLines={1}
        >
          {chat.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const AVATAR_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  unreadBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  lastMessage: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  lastMessageUnread: {
    color: Colors.text,
    fontWeight: "500",
  },
});
