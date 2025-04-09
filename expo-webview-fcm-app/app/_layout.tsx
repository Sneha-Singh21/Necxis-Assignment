import React, { useEffect } from "react";
import { Alert, SafeAreaView } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { WebView, WebViewMessageEvent } from "react-native-webview";
// Optional for token storage
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  useEffect(() => {
    requestUserPermission();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const title = remoteMessage.notification?.title || "New Notification";
      const body =
        remoteMessage.notification?.body || JSON.stringify(remoteMessage);

      Alert.alert(title, body);
    });

    return unsubscribe;
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      console.log("🔔 FCM Token:", fcmToken);
    } else {
      console.log("❌ FCM permission not granted");
    }
  };

  // ✅ Handle message from WebView (token + user info)
  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("🧠 Received from WebView:", data);

      Alert.alert(
        "✅ Login Successful",
        `Welcome ${data.name} (${data.email})`
      );

      // Optional: Store the token
      // await AsyncStorage.setItem('auth_token', data.token);
    } catch (err) {
      console.error("❌ Failed to parse message from WebView:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://nextjs-app-iota-five.vercel.app" }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        onMessage={handleWebViewMessage}
        onNavigationStateChange={(navState) => {
          console.log("🔁 URL Changed:", navState.url);
        }}
        startInLoadingState
      />
    </SafeAreaView>
  );
}
