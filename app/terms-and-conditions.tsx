import { Colors } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TermsAndConditions() {

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>
                Terms and Conditions
            </Text>

            <Text style={styles.paragraph}>
                Welcome to Highr. By accessing or using this application, you agree to the following terms and conditions. If you do not agree, please do not use the app.
            </Text>

            <Text style={styles.sectionTitle}>1. Use of the Platform</Text>
            <Text style={styles.paragraph}>
                Highr is a platform designed to connect job applicants with recruiters. You agree to use the platform only for its intended purposes.
            </Text>

            <Text style={styles.sectionTitle}>2. User Accounts</Text>
            <Text style={styles.paragraph}>
                You are responsible for maintaining the confidentiality of your account and ensuring that all information you provide is accurate and up to date.
            </Text>

            <Text style={styles.sectionTitle}>3. Content Responsibility</Text>
            <Text style={styles.paragraph}>
                Users are responsible for any content they submit, including job postings, profile information, and messages. Highr is not responsible for verifying the accuracy of user-submitted content.
            </Text>

            <Text style={styles.sectionTitle}>4. Privacy</Text>
            <Text style={styles.paragraph}>
                Your data will be handled in accordance with our privacy practices. By using Highr, you consent to the collection and use of your information as necessary to provide the service.
            </Text>

            <Text style={styles.sectionTitle}>5. Prohibited Activities</Text>
            <Text style={styles.paragraph}>
                You agree not to misuse the platform, including but not limited to posting false information, spamming, harassment, or attempting to gain unauthorized access to the system.
            </Text>

            <Text style={styles.sectionTitle}>6. Termination</Text>
            <Text style={styles.paragraph}>
                We reserve the right to suspend or terminate your account at any time if you violate these terms.
            </Text>

            <Text style={styles.sectionTitle}>7. Disclaimer</Text>
            <Text style={styles.paragraph}>
                Highr is provided "as is" without warranties of any kind. We do not guarantee job placement or hiring outcomes.
            </Text>

            <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
            <Text style={styles.paragraph}>
                These terms may be updated from time to time. We will notify users of any significant changes.
            </Text>

            <Button
                mode="contained"
                onPress={() => router.back()}
                style={{ marginTop: 20 }}
            >
                Back
            </Button>

        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 24,
    },
    title: {
        marginBottom: 16,
    },
    paragraph: {
        marginBottom: 12,
        lineHeight: 22,
    },
    sectionTitle: {
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 4,
        color: Colors.text,
    },
});

