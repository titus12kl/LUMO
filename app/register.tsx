import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import { useUser } from "../context/UserContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

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
      setPhoto(result.assets[0].uri);
    }
  };

  const handleRegister = () => {
    if (!name.trim() || !email.trim()) return;

    register({
      name: name.trim(),
      email: email.trim(),
      photo,
    });

    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TouchableOpacity style={styles.avatar} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.image} />
          ) : (
            <Text style={styles.avatarText}>Add Photo</Text>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#7A8395"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#7A8395"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
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
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1B263B",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    overflow: "hidden",
  },
  avatarText: {
    color: "#00E0FF",
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  input: {
    backgroundColor: "#1B263B",
    padding: 15,
    borderRadius: 12,
    color: "white",
    marginBottom: 18,
  },
  button: {
    backgroundColor: "#00E0FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "700",
    color: "#000",
  },
});
