'use client';

import { useEffect, useState } from 'react';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';
import {
  Button,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      // user is set by onAuthStateChanged
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {user ? `Welcome, ${user.displayName}` : 'Sign in to continue'}
        </Typography>

        {user ? (
          <>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }}
            />
            <Typography variant="body1" sx={{ mb: 2 }}>
              Email: {user.email}
            </Typography>
            <Button variant="outlined" color="error" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleSignIn}>
            Sign in with Google
          </Button>
        )}
      </Paper>
    </Container>
  );
}
