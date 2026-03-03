import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useUser } from "../context/UserContext";

export default function Index() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;

  return <Redirect href="/(tabs)" />;
}
