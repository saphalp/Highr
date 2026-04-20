//this screen will list the matches giving them the ability to chat

// for now the recruiter navigation test screen is here, but we will move it to a new recruiter-only area later

import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function Matches() {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          router.push("/recruiter/recruiter-job-postings");
        }}
      >
        My Job Postings
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

