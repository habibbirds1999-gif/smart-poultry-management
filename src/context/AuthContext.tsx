import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testConnection } from '../firebase';

export interface UserProfile {
  userId: string;
  email?: string;
  phone?: string;
  displayName?: string;
  farmName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  syncStatus: SyncStatus;
  setSyncStatus: (s: SyncStatus) => void;
  loginWithEmailOrPhone: (identifier: string, pass: string) => Promise<void>;
  registerWithEmailOrPhone: (
    identifier: string,
    pass: string,
    farmName?: string,
    ownerName?: string,
    phone?: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function normalizeIdentifierToEmail(identifier: string): string {
  const clean = identifier.trim();
  if (clean.includes('@')) {
    return clean.toLowerCase();
  }
  // Convert mobile number to standard email format
  const digits = clean.replace(/\D/g, '');
  return `phone_${digits}@smartpoultry.app`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  // Initial connection test
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            // Create user profile if none exists
            const newProfile: UserProfile = {
              userId: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'খামারি (Farmer)',
              farmName: 'স্মার্ট পোল্ট্রি খামার',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmailOrPhone = async (identifier: string, pass: string) => {
    setLoading(true);
    try {
      const email = normalizeIdentifierToEmail(identifier);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const registerWithEmailOrPhone = async (
    identifier: string,
    pass: string,
    farmName?: string,
    ownerName?: string,
    phone?: string
  ) => {
    setLoading(true);
    try {
      const email = normalizeIdentifierToEmail(identifier);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const displayName = ownerName || farmName || 'খামারি ভাই';

      if (cred.user) {
        try {
          await updateProfile(cred.user, { displayName });
        } catch {
          // ignore profile update error
        }

        const newProfile: UserProfile = {
          userId: cred.user.uid,
          email: identifier.includes('@') ? identifier : email,
          phone: phone || (identifier.includes('@') ? '' : identifier),
          displayName,
          farmName: farmName || 'স্মার্ট পোল্ট্রি খামার',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
          setUserProfile(newProfile);
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `users/${cred.user.uid}`);
        }
      }
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      if (cred.user) {
        const userDocRef = doc(db, 'users', cred.user.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          const newProfile: UserProfile = {
            userId: cred.user.uid,
            email: cred.user.email || '',
            displayName: cred.user.displayName || 'খামারি ভাই',
            farmName: 'স্মার্ট পোল্ট্রি খামার',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile(newProfile);
        }
      }
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const loginAsGuest = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        syncStatus,
        setSyncStatus,
        loginWithEmailOrPhone,
        registerWithEmailOrPhone,
        loginWithGoogle,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
