import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.characters}
          resizeMode="contain"
        />
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.logo}>Highr</Text>
        <Text style={styles.tagline}>Find your perfect job match</Text>
        <Text style={styles.description}>
          Swipe right on jobs you love.{'\n'}Let employers find you.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Button
          mode="contained"
          style={styles.buttonPrimary}
          labelStyle={styles.buttonText}
          onPress={() => router.push('/signup')}
        >
          Get Started
        </Button>

        <Button
          mode="outlined"
          style={styles.buttonSecondary}
          labelStyle={styles.buttonOutlineText}
          onPress={() => router.push('/login')}
        >
          I already have an account
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 60,
  },
  characters: {
    width: 500,
    height: 450,
  },
  middleSection: {
    alignItems: 'center',
  },
  logo: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSection: {
    marginBottom: 32,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 12,
    padding: 4,
  },
  buttonSecondary: {
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 4,
  },
  buttonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});