import { Stack } from "expo-router";
import { SessionProvider } from "../context/SessionContext";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="station/[id]" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="success" />
        </Stack>
      </SessionProvider>
    </UserProvider>
  );
}
