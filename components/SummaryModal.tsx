import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type SummaryData = {
  fitScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  strengths: string[];
  gaps: string[];
};

type Props = {
  visible: boolean;
  status: 'loading' | 'success' | 'error';
  data: SummaryData | null;
  errorMessage: string;
  onClose: () => void;
};

function scoreColor(score: number) {
  if (score >= 70) return '#00BFA5';
  if (score >= 40) return '#F5A623';
  return '#FF6B6B';
}

function ScoreBadge({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <View style={[styles.scoreBadge, { borderColor: color }]}>
      <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
      <Text style={styles.scoreLabel}>/ 100</Text>
      <Text style={[styles.scoreTag, { color }]}>Fit Score</Text>
    </View>
  );
}

function ChipRow({ items, color }: { items: string[]; color: string }) {
  if (!items.length) return <Text style={styles.emptyNote}>None</Text>;
  return (
    <View style={styles.chipRow}>
      {items.map((item, i) => (
        <View key={i} style={[styles.chip, { borderColor: color, backgroundColor: `${color}18` }]}>
          <Text style={[styles.chipText, { color }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function BulletList({ items, icon, iconColor }: { items: string[]; icon: string; iconColor: string }) {
  if (!items.length) return <Text style={styles.emptyNote}>None listed</Text>;
  return (
    <View style={styles.bulletList}>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Ionicons name={icon as any} size={14} color={iconColor} style={styles.bulletIcon} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

export default function SummaryModal({ visible, status, data, errorMessage, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={[styles.sheet, { maxHeight: SCREEN_HEIGHT * 0.82 }]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>AI Summary</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {status === 'loading' && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Analyzing match…</Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {status === 'success' && data && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.scoreRow}>
              <ScoreBadge score={data.fitScore} />
              <Text style={styles.summary}>{data.summary}</Text>
            </View>

            <View style={styles.divider} />

            <SectionLabel title="Matched Skills" />
            <ChipRow items={data.matchedSkills} color="#00BFA5" />

            <SectionLabel title="Missing Skills" />
            <ChipRow items={data.missingSkills} color="#FF6B6B" />

            <View style={styles.divider} />

            <SectionLabel title="Strengths" />
            <BulletList items={data.strengths} icon="checkmark-circle" iconColor="#00BFA5" />

            <SectionLabel title="Gaps" />
            <BulletList items={data.gaps} icon="warning" iconColor="#F5A623" />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: Colors.outline,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outline,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  scoreBadge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
  scoreLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
  },
  scoreTag: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  summary: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.outline,
    marginVertical: 16,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyNote: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  bulletList: {
    gap: 8,
    marginBottom: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletIcon: {
    marginTop: 2,
  },
  bulletText: {
    color: Colors.text,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
});
