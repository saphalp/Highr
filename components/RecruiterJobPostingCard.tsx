import { Colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Text } from 'react-native-paper';


type Props = {
  title: string;
  subtitle: string;
  description: string;
  active: boolean;
  onToggleActive: () => void;
  onDelete: () => void;
};


export default function RecruiterJobPostingCard({ title, subtitle, description, active, onToggleActive, onDelete }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.statusContainer}>
        <Chip
          mode="outlined"
          onPress={onToggleActive}
          textStyle={styles.statusText}
          style={active ? styles.activeChip : styles.inactiveChip}
        >
          {active ? 'Enabled' : 'Disabled'}
        </Chip>
      </View>

      <Card.Title
        title={title}
        subtitle={subtitle}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />

      <Card.Content>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.deleteContainer}>
          <IconButton
            icon="delete"
            size={24}
            iconColor={Colors.text}
            onPress={onDelete}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, marginBottom: 16, position: 'relative', paddingBottom: 8 },
  statusContainer: { position: 'absolute', top: 8, right: 8, zIndex: 1 },
  statusText: { color: Colors.text, fontSize: 12, fontWeight: 'bold' },
  activeChip: { borderColor: Colors.primary },
  inactiveChip: { borderColor: Colors.textMuted },
  cardTitle: { color: Colors.text, paddingRight: 40 },
  cardSubtitle: { color: Colors.textMuted },
  description: { color: Colors.text },
  deleteContainer: { position: 'absolute', right: 8, bottom: 2 },
});