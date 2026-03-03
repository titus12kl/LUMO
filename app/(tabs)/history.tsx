import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSessions } from "../../context/SessionContext";

export default function HistoryScreen() {
  const { sessions } = useSessions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charging History</Text>

      {sessions.length === 0 ? (
        <Text style={styles.empty}>No charging sessions yet</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.station}>{item.stationName}</Text>
              <Text style={styles.text}>Time: {item.time} sec</Text>
              <Text style={styles.text}>Energy: {item.energy} kWh</Text>
              <Text style={styles.text}>Cost: ${item.cost}</Text>
            </View>
          )}
        />
      )}
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
  empty: {
    color: "#aaa",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#1C2333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  station: {
    color: "#00E0FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    marginTop: 5,
  },
});
