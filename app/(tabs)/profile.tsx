import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useUser();

  const [name, setName] = useState("");

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  if (!user) return null;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await updateUser({ photo: result.assets[0].uri });
    }
  };

  const saveName = async () => {
    const clean = name.trim();
    if (!clean) return;
    await updateUser({ name: clean });
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <TouchableOpacity style={styles.avatar} onPress={pickImage}>
          {user.photo ? (
            <Image source={{ uri: user.photo }} style={styles.image} />
          ) : (
            <Text style={styles.avatarText}>Add Photo</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#7A8395"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveName}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.email}>{user.email}</Text>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 28,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1B263B",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  avatarText: { color: "#00E0FF", fontWeight: "700" },
  label: { color: "#A0AEC0", marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#1B263B",
    padding: 15,
    borderRadius: 12,
    color: "white",
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#00E0FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  saveText: { fontWeight: "700", color: "#000" },
  divider: { height: 1, backgroundColor: "#22304A", marginVertical: 18 },
  email: { color: "#A0AEC0", textAlign: "center", marginBottom: 18 },
  logoutBtn: {
    backgroundColor: "#FF4D4D",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "white", fontWeight: "700" },
});
