import * as ExpoLocation from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const stations = [
  {
    id: "1",
    name: "Lumo Centro",
    price: 6.5,
    available: true,
    type: "DC Fast",
    power: 120,
    latitude: 19.4326,
    longitude: -99.1332,
  },
  {
    id: "2",
    name: "Lumo Polanco",
    price: 7.0,
    available: false,
    type: "Level 2",
    power: 22,
    latitude: 19.4361,
    longitude: -99.2036,
  },
];

async function openDirections(destLat: number, destLng: number) {
  try {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Activa la ubicación para generar la ruta automática.",
      );
      return;
    }

    const loc = await ExpoLocation.getCurrentPositionAsync({});
    const originLat = loc.coords.latitude;
    const originLng = loc.coords.longitude;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;

    await Linking.openURL(url);
  } catch {
    Alert.alert("Error", "No se pudo abrir la navegación.");
  }
}

export default function StationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const station = stations.find((s) => s.id === id);

  const [charging, setCharging] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (charging) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [charging]);

  if (!station) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>Station not found</Text>
      </View>
    );
  }

  const energyConsumed = seconds * 0.05;
  const totalCost = energyConsumed * station.price;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{station.name}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Type</Text>
        <Text style={styles.value}>{station.type}</Text>

        <Text style={styles.label}>Power</Text>
        <Text style={styles.value}>{station.power} kW</Text>

        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>${station.price} / kWh</Text>

        <Text style={styles.label}>Availability</Text>
        <Text style={styles.value}>
          {station.available ? "Available" : "Occupied"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.secondaryButton, charging && { opacity: 0.5 }]}
        disabled={charging}
        onPress={() => openDirections(station.latitude, station.longitude)}
      >
        <Text style={styles.secondaryButtonText}>Dirigirte</Text>
      </TouchableOpacity>

      {charging && (
        <View style={styles.sessionBox}>
          <Text style={styles.sessionText}>Time: {seconds} sec</Text>
          <Text style={styles.sessionText}>
            Energy: {energyConsumed.toFixed(2)} kWh
          </Text>
          <Text style={styles.sessionText}>Cost: ${totalCost.toFixed(2)}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          !station.available && !charging ? { opacity: 0.5 } : null,
        ]}
        disabled={!station.available && !charging}
        onPress={() => {
          if (charging) {
            setCharging(false);

            router.push({
              pathname: "/payment",
              params: {
                cost: totalCost.toFixed(2),
                energy: energyConsumed.toFixed(2),
                time: seconds.toString(),
              },
            });
          } else {
            setSeconds(0);
            setCharging(true);
          }
        }}
      >
        <Text style={styles.buttonText}>
          {charging ? "Stop Charging" : "Start Charging"}
        </Text>
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
    marginTop: 10,
  },
  value: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 16,
    backgroundColor: "#1C2333",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2C364D",
  },
  secondaryButtonText: {
    color: "#00E0FF",
    fontWeight: "bold",
  },
  sessionBox: {
    marginTop: 25,
    padding: 20,
    backgroundColor: "#16213E",
    borderRadius: 12,
  },
  sessionText: {
    color: "#00E0FF",
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    marginTop: 18,
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
