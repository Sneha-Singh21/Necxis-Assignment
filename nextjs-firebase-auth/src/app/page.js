'use client';

import { useEffect, useState } from 'react';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import {
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  Fade,
  CircularProgress,
} from '@mui/material';

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

  // 🔁 Send token to React Native WebView (or fallback deep link)
  useEffect(() => {
    const sendTokenToWebView = async () => {
      if (user) {
        const token = await user.getIdToken();

        const payload = {
          token,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        };

        if (typeof window !== 'undefined' && window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        } else {
          // fallback (optional): open app via deep link
          window.location.href = `myapp://login?token=${token}`;
        }
      }
    };

    sendTokenToWebView();
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: 'linear-gradient(to right, #e0c3fc, #8ec5fc)' }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        padding: 2,
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, mb: 2, fontFamily: 'Poppins, sans-serif' }}
          >
            {user ? `Hey, ${user.displayName}!` : 'Welcome 👋'}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 3, color: '#666' }}>
            {user ? 'Glad to see you here!' : 'Please sign in to continue'}
          </Typography>

          {user ? (
            <>
              <Avatar
                src={user.photoURL}
                alt={user.displayName}
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto 16px',
                  border: '3px solid #fda085',
                }}
              />
              <Typography variant="body2" sx={{ mb: 3, color: '#444' }}>
                {user.email}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                fullWidth
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
                background: 'linear-gradient(to right, #667eea, #764ba2)',
                color: '#fff',
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
