import React, { useEffect } from 'react';
import { Alert, SafeAreaView } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function App() {
  useEffect(() => {
    requestUserPermission();

    // Listen for FCM foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification?.title || 'New Notification';
      const body = remoteMessage.notification?.body || JSON.stringify(remoteMessage);

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
      console.log('🔔 FCM Token:', fcmToken);
    } else {
      console.log('❌ FCM permission not granted');
    }
  };

  // 🔁 Handle messages from WebView (user data from Next.js)
  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('🧠 Received from WebView:', data);

      // Show an alert with user info
      Alert.alert('✅ Login Successful', `Welcome ${data.name} (${data.email})`);

      // 🔒 Optionally store the token using SecureStore for later API calls
      // await SecureStore.setItemAsync('auth_token', data.token);
    } catch (err) {
      console.error('❌ Failed to parse message from WebView:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://nextjs-app-iota-five.vercel.app/' }} // your deployed Next.js site
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled={true}
        startInLoadingState
        onMessage={handleWebViewMessage}
      />
    </SafeAreaView>
  );
}
