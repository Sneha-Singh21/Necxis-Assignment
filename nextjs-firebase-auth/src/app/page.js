"use client";

import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import {
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Paper,
  Fade,
} from "@mui/material";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Send token to React Native WebView if already logged in
  useEffect(() => {
    const sendTokenToWebView = async () => {
      if (user && typeof window !== "undefined" && window.ReactNativeWebView) {
        const idToken = await user.getIdToken();
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            token: idToken,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
          })
        );
      }
    };

    sendTokenToWebView();
  }, [user]);

  // 🔐 Google Sign-In
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      if (typeof window !== "undefined" && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            token: idToken,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
          })
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // 🚪 Sign out
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 🌀 Loading Spinner
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          background: "linear-gradient(to right, #e0c3fc, #8ec5fc)",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // ✅ Main UI
  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        padding: 2,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, mb: 2, fontFamily: "Poppins, sans-serif" }}
          >
            {user ? `Hey, ${user.displayName}!` : "Welcome 👋"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 3, color: "#666" }}>
            {user ? "Glad to see you here!" : "Please sign in to continue"}
          </Typography>

          {user ? (
            <>
              <Avatar
                src={user.photoURL}
                alt={user.displayName}
                sx={{
                  width: 100,
                  height: 100,
                  margin: "0 auto 16px",
                  border: "3px solid #fda085",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />

              <Typography variant="body2" sx={{ mb: 3, color: "#444" }}>
                {user.email}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                sx={{
                  borderRadius: 3,
                  fontWeight: 500,
                  textTransform: "none",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "#ffe0e0",
                  },
                }}
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleSignIn}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(to right, #667eea, #764ba2)",
                color: "#fff",
                fontWeight: 500,
                textTransform: "none",
                transition: "0.3s",
                "&:hover": {
                  background: "linear-gradient(to right, #5a67d8, #6b46c1)",
                },
              }}
            >
              Sign in with Google
            </Button>
          )}
        </Paper>
      </Fade>
    </Box>
  );
}
