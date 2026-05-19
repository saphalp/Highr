import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  onPass: () => void;
  onSuperLike: () => void;
  onLike: () => void;
};

export default function SwipeActionButtons({ onPass, onSuperLike, onLike }: Props) {
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.passButton} onPress={onPass}>
        <Ionicons name="close" size={32} color="#FF6B6B" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.superLikeButton} onPress={onSuperLike}>
        <Ionicons name="star" size={24} color="#00C9FF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.likeButton} onPress={onLike}>
        <Ionicons name="heart" size={32} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    paddingBottom: 36,
    paddingTop: 16,
  },
  passButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#00C9FF",
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
