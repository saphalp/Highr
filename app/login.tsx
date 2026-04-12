import { StyleSheet, View, Text, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.characterContainer}>
        <Image
          source={require('@/assets/images/characters.png')}
          style={styles.characters}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome back!</Text>
      <Text style={styles.subtitle}>Please enter your details</Text>

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
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye' : 'eye-off'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
        textColor="#fff"
        theme={{ colors: { primary: '#6C63FF', onSurfaceVariant: '#888' }}}
      />

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        LOG IN
      </Button>

      <Text style={styles.signupLink}>
        Don't have an account?{' '}
        <Text style={styles.signupLinkBold} onPress={() => router.push('/signup')}>
          Sign up
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
  characterContainer: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1A1A2E',
  },
  characters: {
    width: 250,
    height: 150,
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
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupLink: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
  },
  signupLinkBold: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
});