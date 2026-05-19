import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

WebBrowser.maybeCompleteAuthSession();

const characterImages = [
  require("@/assets/images/characters.png"),
  require("@/assets/images/character2.png"),
  require("@/assets/images/character3.png"),
  require("@/assets/images/character4.png"),
  require("@/assets/images/character5.png"),
];

export default function LoginScreen() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error">("info");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkProfileComplete = async (userId: string, isApplicant: boolean) => {
    if (isApplicant) {
      const { data, error } = await supabase
        .from("Applicant")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.log("Applicant profile check error:", error.message);
      }

      return !!data;
    }

    const { data, error } = await supabase
      .from("Employer")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.log("Employer profile check error:", error.message);
    }

    return !!data;
  };

  const routeAfterLogin = async (user: any) => {
    const role = user?.user_metadata?.role;

    if (!role) {
      await supabase.auth.signOut();

      setMessageType("error");
      setMessage("Account setup is incomplete. Please sign up first.");
      return;
    }

    const isApplicant = role === "applicant";
    const isEmployer = role === "employer";

    if (!isApplicant && !isEmployer) {
      await supabase.auth.signOut();

      setMessageType("error");
      setMessage("Invalid account role. Please contact support.");
      return;
    }

    const profileComplete = await checkProfileComplete(user.id, isApplicant);

    if (!profileComplete) {
      router.replace(`/profile-setup?isApplicant=${isApplicant}`);
      return;
    }

    router.replace("/(tabs)/discover");
  };

  const handleLogin = async () => {
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setMessageType("error");
      setMessage("Please enter email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setMessageType("error");
      setMessage("Could not get user session.");
      return;
    }

    await routeAfterLogin(data.user);
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
        setMessage("Could not get Google user session.");
        return;
      }

      const userRole = user.user_metadata?.role;

      /**
       * Important:
       * Login page should not allow brand-new Google users.
       * Supabase may create an auth user during Google OAuth,
       * but if the user has no saved role, they have not completed signup.
       */
      if (!userRole) {
        await supabase.auth.signOut();

        setMessageType("error");
        setMessage(
          "Account not found. Please sign up first or use a different Google account."
        );

        return;
      }

      await routeAfterLogin(user);
    } catch (err: any) {
      setMessageType("error");
      setMessage(err.message ?? "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (showPassword) {
      let current = 1;
      setFrameIndex(1);

      intervalRef.current = setInterval(() => {
        current += 1;
        setFrameIndex(current);

        if (current >= 3 && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, 200);
    } else if (isFocused) {
      setFrameIndex(4);
    } else {
      setFrameIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [showPassword, isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.characterContainer}>
        <Image
          source={characterImages[frameIndex]}
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
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        onFocus={() => {
          setIsFocused(true);
          setShowPassword(false);
        }}
        onBlur={() => setIsFocused(false)}
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
        value={password}
        onChangeText={setPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
        textColor={Colors.text}
        theme={{
          colors: {
            primary: Colors.primary,
            onSurfaceVariant: Colors.textMuted,
          },
        }}
      />

      {message ? (
        <Text
          style={[
            styles.message,
            messageType === "error" && styles.errorMessage,
          ]}
        >
          {message}
        </Text>
      ) : null}

      <Pressable
        style={[
          styles.googleButton,
          googleLoading && styles.googleButtonDisabled,
        ]}
        onPress={handleGoogleSignIn}
        disabled={googleLoading}
      >
        <Image
          source={require("@/assets/images/google-logo.png")}
          style={styles.googleLogo}
        />

        <Text style={styles.googleButtonText}>
          {googleLoading ? "Signing in..." : "Sign in Using Google"}
        </Text>
      </Pressable>

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handleLogin}
      >
        LOG IN
      </Button>

      <Text style={styles.signupLink}>
        Don&apos;t have an account?{" "}
        <Text
          style={styles.signupLinkBold}
          onPress={() => router.push("/signup")}
        >
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
    justifyContent: "center",
  },
  characterContainer: {
    alignItems: "center",
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
  message: {
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 12,
  },
  errorMessage: {
    color: Colors.error,
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
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleLogo: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginBottom: 24,
    padding: 4,
  },
  buttonText: {
    color: Colors.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  signupLink: {
    color: Colors.textMuted,
    textAlign: "center",
    fontSize: 14,
  },
  signupLinkBold: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});