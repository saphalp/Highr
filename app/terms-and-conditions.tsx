import { Colors } from "@/constants/theme";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";


export default function TermsAndConditions() {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>
                Terms and Conditions
            </Text>

            <Text style={styles.paragraph}>
                Welcome to Highr! By using our app, you agree to the following terms and conditions:
                1. PLACEHOLDER 
            </Text>

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
});

