import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../../context/UserContext";

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.replace("/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {user.photo && (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        )}

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#111A2B",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  email: {
    color: "#A0AEC0",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});
