import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Subscribe to Firebase auth state
  useEffect(() => {
    console.log('[AuthContext] Subscribing to onAuthStateChanged');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[AuthContext] Auth state changed:', user ? user.uid : 'no user');
      setCurrentUser(user);
      setError(null);

      if (!user) {
        setRole(null);
        setInitializing(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          console.log('[AuthContext] Loaded user document:', {
            uid: user.uid,
            role: data.role,
          });
          setRole(data.role || null);
        } else {
          console.warn('[AuthContext] No user document found for uid:', user.uid);
          setRole(null);
        }
      } catch (err) {
        console.error('[AuthContext] Failed to load user document:', err);
        setRole(null);
        setError(err);
      } finally {
        setInitializing(false);
      }
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from onAuthStateChanged');
      unsubscribe();
    };
  }, []);

  const register = useCallback(
    async ({ name, email, password }) => {
      setActionLoading(true);
      setError(null);
      console.log('[AuthContext] Registering user with email:', email);

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = cred;

        const userRef = doc(db, 'users', user.uid);
        const userData = {
          uid: user.uid,
          name,
          email: user.email,
          role: 'candidate', // default role
          createdAt: serverTimestamp(),
        };

        await setDoc(userRef, userData);
        console.log('[AuthContext] Created Firestore user document:', userData);

        // Auth state listener will populate currentUser and role.
        return user;
      } catch (err) {
        console.error('[AuthContext] Register error:', err);
        setError(err);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  const login = useCallback(
    async ({ email, password }) => {
      setActionLoading(true);
      setError(null);
      console.log('[AuthContext] Logging in with email:', email);

      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        console.log('[AuthContext] Login successful for uid:', cred.user.uid);
        // Role will be refreshed by onAuthStateChanged listener
        return cred.user;
      } catch (err) {
        console.error('[AuthContext] Login error:', err);
        setError(err);
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setActionLoading(true);
    setError(null);
    console.log('[AuthContext] Logging out current user');

    try {
      await signOut(auth);
    } catch (err) {
      console.error('[AuthContext] Logout error:', err);
      setError(err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      role,
      loading: initializing || actionLoading,
      initializing,
      actionLoading,
      error,
      login,
      register,
      logout,
    }),
    [currentUser, role, initializing, actionLoading, error, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

