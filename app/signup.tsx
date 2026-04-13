import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Highr today</Text>

      <TextInput
        label="Username"
        mode="outlined"
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />
      <TextInput
        label="Confirm Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
      />

      <Button
        mode="contained"
        style={styles.buttonPrimary}
        labelStyle={styles.buttonText}
        onPress={() => router.push('/login')}
      >
        Sign Up as Job Seeker
      </Button>

      <Button
        mode="contained"
        style={styles.buttonSecondary}
        labelStyle={styles.buttonText}
        onPress={() => router.push('/login')}
      >
        Sign Up as Employer
      </Button>

      <Text style={styles.loginLink}>
        Already have an account?{' '}
        <Text style={styles.loginLinkBold} onPress={() => router.push('/login')}>
          Log in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 12,
    padding: 4,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  buttonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
  },
  loginLinkBold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
