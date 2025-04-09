import React, { useEffect } from 'react';
import { Alert, Platform, SafeAreaView } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { WebView, WebViewMessageEvent } from 'react-native-webview';


export default function App() {
  useEffect(() => {
    requestUserPermission();

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

  // ✅ Listen for messages from WebView (like login token)
  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('🧠 Received from WebView:', data);
  
      Alert.alert('✅ Login Successful', `Welcome ${data.name} (${data.email})`);
    } catch (err) {
      console.error('❌ Failed to parse message from WebView:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        source={{ uri: 'https://nextjs-app-iota-five.vercel.app/' }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled={true} // ✅ Needed for Google Sign-In
        startInLoadingState
        onMessage={handleWebViewMessage} // ✅ This is what receives the token
      />
    </SafeAreaView>
  );
}
