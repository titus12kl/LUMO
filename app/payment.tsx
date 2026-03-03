import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSessions } from "../context/SessionContext";

export default function PaymentScreen() {
  const { cost, energy, time } = useLocalSearchParams<{
    cost: string;
    energy: string;
    time: string;
  }>();

  const { addSession } = useSessions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charging Summary</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{time} sec</Text>

        <Text style={styles.label}>Energy</Text>
        <Text style={styles.value}>{energy} kWh</Text>

        <Text style={styles.label}>Total Cost</Text>
        <Text style={styles.value}>${cost}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          addSession({
            id: Date.now().toString(),
            stationName: "Lumo Station",
            time: Number(time),
            energy: Number(energy),
            cost: Number(cost),
            date: new Date().toISOString(),
          });

          router.push("/success");
        }}
      >
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0A0F1C",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginTop: 50,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1C2333",
    padding: 20,
    borderRadius: 12,
  },
  label: {
    color: "#aaa",
    marginTop: 15,
  },
  value: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#00E0FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
});
