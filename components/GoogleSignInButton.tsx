import { supabase } from '@/lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    try {
      setLoading(true);

      const redirectTo = AuthSession.makeRedirectUri({
        scheme: 'highr',
        path: 'auth/callback',
      });

      console.log('Redirect URI:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );

      if (result.type === 'success') {
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (code) {
          const { error: sessionError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (sessionError) throw sessionError;

          Alert.alert('Success', 'Signed in with Google!');
        }
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert('Google Sign-In Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      style={[styles.button, loading && styles.disabled]}
      onPress={signInWithGoogle}
      disabled={loading}
    >
      <Text style={styles.text}>
        {loading ? 'Signing in...' : 'Continue with Google'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 12,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
});