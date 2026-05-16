import MessageBar from "@/components/MessageBar";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "error">("info");

  const handleSignUpApplicant = async () => {
    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { role: "applicant" } },
    });
    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }
    setMessageType("info");
    setMessage(`Confirmation link sent to ${email}`);
    router.push("/login");
  };

  const handleSignUpEmployer = async () => {
    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { role: "employer" } },
    });
    if (error) {
      setMessageType("error");
      setMessage(error.message);
      return;
    }
    setMessageType("info");
    setMessage(`Confirmation link sent to ${email}`);
    router.push("/login");
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
        secureTextEntry
        style={styles.input}
        textColor={Colors.text}
        value={password}
        onChangeText={setPassword}
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
        secureTextEntry
        style={styles.input}
        textColor={Colors.text}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        theme={{
          colors: {
            primary: Colors.primary,
            onSurfaceVariant: Colors.textMuted,
          },
        }}
      />

      <Pressable style={styles.googleButton} onPress={() => console.log("Google sign-in pressed")}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>

      <Text style={styles.orText}>or sign up with email</Text>

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
        <Text
          style={styles.loginLinkBold}
          onPress={() => router.push("/login")}
        >
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

googleButtonText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#111827",
},

orText: {
  textAlign: "center",
  color: "#6b7280",
  marginBottom: 16,
},
});
