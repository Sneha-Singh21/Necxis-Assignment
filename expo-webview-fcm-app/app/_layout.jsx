import React, { useEffect, useRef, useState } from "react";
import { Alert, SafeAreaView, ActivityIndicator, View, Text } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { WebView, WebViewMessageEvent } from "react-native-webview";
// Optional for token storage
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = "https://nextjs-app-iota-five.vercel.app";
  
  // Track if we're in the OAuth flow
  const [isInAuthFlow, setIsInAuthFlow] = useState(false);

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

  // Handle message from WebView (token + user info)
  const handleWebViewMessage = async (event) => {
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
          `Welcome ${data.name || 'User'} (${data.email || 'No email'})`,
          [{ text: 'OK' }]
        );
        
        // Optional: Store the token
        // await AsyncStorage.setItem('auth_token', data.token);
      }
    } catch (err) {
      console.error("❌ Failed to parse message from WebView:", err);
      console.error("Raw data:", event.nativeEvent.data);
    }
  };

  // Handle WebView navigation state changes
  const handleNavigationStateChange = (navState) => {
    console.log("🔁 URL Changed:", navState.url);
    
    // Check if we're in an authentication flow (URL contains accounts.google.com or firebaseauth)
    const isAuthUrl = 
      navState.url.includes('accounts.google.com') || 
      navState.url.includes('firebaseauth') ||
      navState.url.includes('identitytoolkit') ||
      navState.url.includes('auth/callback');
    
    if (isAuthUrl && !isInAuthFlow) {
      console.log("🔑 Entering auth flow");
      setIsInAuthFlow(true);
    } 
    
    // Check if we've returned from auth flow back to our app
    if (isInAuthFlow && navState.url.startsWith(BASE_URL)) {
      console.log("🔑 Auth flow completed, returned to app");
      setIsInAuthFlow(false);
    }
  };
  
  // Add this JavaScript to fix the communication
  const INJECTED_JAVASCRIPT = `
    (function() {
      if (!window.ReactNativeWebView) { 
        console.log('⚙️ Injecting ReactNativeWebView object');
        window.ReactNativeWebView = { 
          postMessage: function(data) { 
            console.log('📤 Attempting to send message:', data);
            window.postMessage(data, '*');
          }
        };
      }
      
      // Listen for when Firebase auth completes and user object becomes available
      const checkForUser = setInterval(() => {
        const userSection = document.querySelector('[aria-label="Account"]');
        if (userSection) {
          console.log('✅ User detected, attempting to send data');
          // Give the app a moment to fully load user data
          setTimeout(() => {
            // Try to trigger the existing effect that sends the token
            const event = new Event('userdetected');
            window.dispatchEvent(event);
          }, 1000);
          clearInterval(checkForUser);
        }
      }, 1000);
      
      // Add a global error handler to catch issues
      window.addEventListener('error', function(e) {
        console.log('🚨 Error caught:', e.message);
      });
      
      true;
    })();
  `;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && (
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ uri: BASE_URL }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        onMessage={handleWebViewMessage}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log('🔄 Started loading:', nativeEvent.url);
        }}
        onLoadEnd={() => {
          console.log('✅ Finished loading');
          setIsLoading(false);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('❌ WebView error:', nativeEvent);
          Alert.alert('Error', 'Failed to load the web page');
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error(`❌ HTTP Error ${nativeEvent.statusCode}`);
        }}
        startInLoadingState={true}
        // This is crucial: allow the WebView to open URLs in the same WebView
        // instead of trying to open them in the device browser
        setSupportMultipleWindows={false}
      />
    </SafeAreaView>
  );
}