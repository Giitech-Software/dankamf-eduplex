// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { logoutUser } from '../firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is signed in, now get their custom role from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role); // e.g., 'admin', 'superadmin'
        } else {
          setUserRole(null); // User exists in Auth, but not in our 'users' collection
        }
      } else {
        // User is signed out
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    // Keep both names available because protected routes use the shorter
    // user/role names while the login page uses currentUser/isAdmin.
    user: currentUser,
    role: userRole,
    isAdmin: userRole === 'admin' || userRole === 'superadmin',
    isSuperAdmin: userRole === 'superadmin',
    logout: logoutUser,
  };

  // Show a loading screen while we verify auth state
  if (loading) {
    return <LoadingSpinner fullPage label="Loading Dankamf Educational Complex..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
