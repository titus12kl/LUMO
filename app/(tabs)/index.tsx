import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");

type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const stations: Station[] = [
    {
      id: "1",
      name: "Lumo Centro",
      latitude: 19.4326,
      longitude: -99.1332,
    },
    {
      id: "2",
      name: "Lumo Polanco",
      latitude: 19.4361,
      longitude: -99.2036,
    },
  ];

  // Obtener ubicación
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  // Fórmula Haversine
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calcular estación más cercana
  const nearestStation =
    location &&
    stations.reduce((closest: any, station) => {
      const distance = getDistance(
        location.coords.latitude,
        location.coords.longitude,
        station.latitude,
        station.longitude,
      );

      if (!closest || distance < closest.distance) {
        return { ...station, distance };
      }

      return closest;
    }, null);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          showsUserLocation
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {stations.map((station) => (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude,
              }}
              title={station.name}
              pinColor={nearestStation?.id === station.id ? "green" : "red"}
              onPress={() => router.push(`/station/${station.id}`)}
            />
          ))}
        </MapView>
      )}

      {nearestStation && (
        <View style={styles.recommendation}>
          <Text style={styles.recTitle}>Recommended Station</Text>
          <Text style={styles.recText}>
            {nearestStation.name} — {nearestStation.distance.toFixed(2)} km away
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1C",
  },
  map: {
    width,
    height: height * 0.8,
  },
  recommendation: {
    padding: 15,
    backgroundColor: "#16213E",
  },
  recTitle: {
    color: "#00E0FF",
    fontWeight: "bold",
    fontSize: 16,
  },
  recText: {
    color: "white",
    marginTop: 5,
  },
});
