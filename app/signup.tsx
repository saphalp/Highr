import MessageBar from "@/components/MessageBar";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error">("info");

  const [googleLoading, setGoogleLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmailSignup = () => {
    const errors: string[] = [];

    if (!email.trim()) {
      errors.push("Email is required.");
    }

    if (!password.trim()) {
      errors.push("Password is required.");
    }

    if (!confirmPassword.trim()) {
      errors.push("Confirm password is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() && !emailRegex.test(email.trim())) {
      errors.push("Enter a valid email address.");
    }

    if (password && password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (password && !/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter.");
    }

    if (password && !/[a-z]/.test(password)) {
      errors.push("Password must include at least one lowercase letter.");
    }

    if (password && !/[0-9]/.test(password)) {
      errors.push("Password must include at least one number.");
    }

    if (password && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must include at least one special character.");
    }

    if (password && confirmPassword && password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
      setMessageType("error");
      setMessage(errors.map((error) => `• ${error}`).join("\n"));
      return false;
    }

    return true;
  };

  const handleSignUpApplicant = async () => {
    if (!validateEmailSignup()) return;

    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          role: "applicant",
        },
      },
    });

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessageType("error");
      setMessage(
        "An account with this email already exists. Please log in instead."
      );
      return;
    }

    setMessageType("info");
    setMessage(`Confirmation link sent to ${email.trim()}`);

    router.push("/login");
  };

  const handleSignUpEmployer = async () => {
    if (!validateEmailSignup()) return;

    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          role: "employer",
        },
      },
    });

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessageType("error");
      setMessage(
        "An account with this email already exists. Please log in instead."
      );
      return;
    }

    setMessageType("info");
    setMessage(`Confirmation link sent to ${email.trim()}`);

    router.push("/login");
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setMessage("");

      const redirectTo = AuthSession.makeRedirectUri({
        scheme: "highr",
        path: "auth/callback",
      });

      console.log("Google redirect URL:", redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        setMessageType("error");
        setMessage(error.message);
        return;
      }

      if (!data?.url) {
        setMessageType("error");
        setMessage("Google sign-in URL was not created.");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type !== "success") {
        return;
      }

      console.log("Google result URL:", result.url);

      const url = new URL(result.url);
      const code = url.searchParams.get("code");

      let sessionData: any = null;
      let sessionError: any = null;

      if (code) {
        const response = await supabase.auth.exchangeCodeForSession(code);

        sessionData = response.data;
        sessionError = response.error;
      } else {
        const params = new URLSearchParams(url.hash.replace("#", ""));

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
          console.log("Returned URL:", result.url);
          setMessageType("error");
          setMessage("No auth code or tokens returned from Google.");
          return;
        }

        const response = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        sessionData = response.data;
        sessionError = response.error;
      }

      if (sessionError) {
        setMessageType("error");
        setMessage(sessionError.message);
        return;
      }

      const user = sessionData.session?.user;

      if (!user) {
        setMessageType("error");
        setMessage("Google sign-in failed. No user session found.");
        return;
      }

      const userRole = user.user_metadata?.role;

      if (!userRole) {
        router.replace("/role-selection");
        return;
      }

      router.replace("/(tabs)/discover");
      return;
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message ?? "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Highr today</Text>

      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        textColor={Colors.text}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        theme={{
          colors: {
            primary: Colors.primary,
            onSurfaceVariant: Colors.textMuted,
          },
        }}
      />

      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry={!showPassword}
        style={styles.input}
        textColor={Colors.text}
        value={password}
        onChangeText={setPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        theme={{
          colors: {
            primary: Colors.primary,
            onSurfaceVariant: Colors.textMuted,
          },
        }}
      />

      <TextInput
        label="Confirm Password"
        mode="outlined"
        secureTextEntry={!showConfirmPassword}
        style={styles.input}
        textColor={Colors.text}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
        theme={{
          colors: {
            primary: Colors.primary,
            onSurfaceVariant: Colors.textMuted,
          },
        }}
      />

      <Pressable
        style={[
          styles.googleButton,
          googleLoading && styles.googleButtonDisabled,
        ]}
        onPress={handleGoogleSignIn}
        disabled={googleLoading}
      >
        <Text style={styles.googleButtonText}>
          {googleLoading ? "Signing in..." : "Sign up Using Google"}
        </Text>
      </Pressable>

      <Button
        mode="contained"
        style={styles.buttonPrimary}
        labelStyle={styles.buttonText}
        onPress={handleSignUpApplicant}
      >
        Sign Up as Job Seeker
      </Button>

      <Button
        mode="contained"
        style={styles.buttonSecondary}
        labelStyle={styles.buttonText}
        onPress={handleSignUpEmployer}
      >
        Sign Up as Employer
      </Button>

      <MessageBar message={message} type={messageType} />

      <Text style={styles.loginLink}>
        Already have an account?{" "}
        <Text style={styles.loginLinkBold} onPress={() => router.push("/login")}>
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
    justifyContent: "center",
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    marginBottom: 12,
  },
  googleButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
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
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 14,
  },
  loginLinkBold: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});