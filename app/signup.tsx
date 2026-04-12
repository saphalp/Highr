import { StyleSheet, View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';

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
        textColor="#fff"
        theme={{ colors: { primary: '#6C63FF', onSurfaceVariant: '#888' }}}
      />
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: '#6C63FF', onSurfaceVariant: '#888' }}}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: '#6C63FF', onSurfaceVariant: '#888' }}}
      />
      <TextInput
        label="Confirm Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: '#6C63FF', onSurfaceVariant: '#888' }}}
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
    backgroundColor: '#1A1A2E',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#2E2E3E',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    marginBottom: 12,
    padding: 4,
  },
  buttonSecondary: {
    backgroundColor: '#4B45A1',
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
});