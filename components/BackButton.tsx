import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';


export type Props = {
  onPress: () => void;
};


export default function BackButton() {
  const router = useRouter();

  return (      
      <Button  
        mode="contained"
        style={styles.backButton}
        labelStyle={styles.backButtonText}
        onPress={() => {router.back()}}
      >
        Back
      </Button>

  );
}

const styles = StyleSheet.create({
  backButton: { backgroundColor: Colors.primary, marginBottom: 24, borderRadius: 8, padding: 4, },
  backButtonText: { color: Colors.text, fontWeight: 'bold', fontSize: 16, },
});
