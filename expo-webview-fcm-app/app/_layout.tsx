import React, { useEffect, useRef } from "react";
import { Alert, SafeAreaView } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { WebView, WebViewMessageEvent } from "react-native-webview";
// Optional for token storage
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const webViewRef = useRef(null);

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
    console.log("📩 Message handler triggered!");
    
    if (!event.nativeEvent.data) {
      console.error("❌ No data received in message");
      return;
    }
    
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("✅ Parsed WebView message:", data);
      
      if (data.token) {
        console.log("✅ Auth token received");
        Alert.alert(
          "✅ Login Successful",
          `Welcome ${data.name || 'User'} (${data.email || 'No email'})`
        );
        
        // Optional: Store the token
        // await AsyncStorage.setItem('auth_token', data.token);
      }
    } catch (err) {
      console.error("❌ Failed to parse message from WebView:", err);
      console.error("Raw data:", event.nativeEvent.data);
    }
  };

  // Inject JavaScript to make the WebView communicate with React Native
  const INJECTED_JAVASCRIPT = `
    window.ReactNativeWebView = window.ReactNativeWebView || {};
    true;
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: "https://nextjs-app-iota-five.vercel.app" }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        onMessage={handleWebViewMessage}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onNavigationStateChange={(navState) => {
          console.log("🔁 URL Changed:", navState.url);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error: ', nativeEvent.statusCode);
        }}
        startInLoadingState
      />
    </SafeAreaView>
  );
}