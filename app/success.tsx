import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Success() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0F1C",
  },
  title: {
    color: "white",
    fontSize: 22,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#00E0FF",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
