import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

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
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
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
        textColor={Colors.text}
        theme={{ colors: { primary: Colors.primary, onSurfaceVariant: Colors.textMuted } }}
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
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: Colors.background,
  },
  characters: {
    width: 250,
    height: 150,
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
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  buttonText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupLink: {
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
  },
  signupLinkBold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
