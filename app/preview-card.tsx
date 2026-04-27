import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';


type Props = {
  title: string;
  subtitle: string;
  description: string;
};


export default function RecruiterJobPostingCard({ title, subtitle, description }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={title}
        subtitle={subtitle}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
      <Card.Content>
        <Text style={styles.description}>{description}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, marginBottom: 16 },
  cardTitle: { color: Colors.text },
  cardSubtitle: { color: Colors.textMuted },
  description: { color: Colors.text },
});