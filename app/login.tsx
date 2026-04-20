import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

const characterImages = [
  require("@/assets/images/characters.png"), // 0 - default
  require("@/assets/images/character2.png"), // 1
  require("@/assets/images/character3.png"), // 2
  require("@/assets/images/character4.png"), // 3 - stop here
  require("@/assets/images/character5.png"), // 4 - looking down
];

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
      return;
    }

    const isApplicant = data.user.user_metadata?.role !== "employer";
    const profileComplete = await checkProfileComplete(data.user.id, isApplicant);

    if (profileComplete) {
      router.push("/(tabs)/discover");
    } else {
      router.push(`/profile-setup?isApplicant=${isApplicant}`);
    }
  };

  const checkProfileComplete = async (userId: string, isApplicant: boolean) => {
    if (isApplicant) {
      const { data } = await supabase
        .from("Applicant")
        .select("f_name, l_name, experience")
        .eq("id", userId)
        .single();
      return !!(data?.f_name && data?.l_name && data?.experience?.length > 0);
    } else {
      const { data } = await supabase
        .from("Employer")
        .select("contact_name, company_name, industry")
        .eq("id", userId)
        .single();
      return !!(data?.contact_name && data?.company_name && data?.industry);
    }
  };

  useEffect(() => {
    if (showPassword) {
      // animate from frame 1 to 3 and stop
      let current = 1;
      setFrameIndex(1);
      intervalRef.current = setInterval(() => {
        current += 1;
        setFrameIndex(current);
        if (current >= 3) {
          clearInterval(intervalRef.current!);
        }
      }, 200);
    } else if (isFocused) {
      // looking down when field is focused
      setFrameIndex(4);
    } else {
      // default
      setFrameIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handleLogin}
      >
        LOG IN
      </Button>

      <Text style={styles.signupLink}>
        Don't have an account?{" "}
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
