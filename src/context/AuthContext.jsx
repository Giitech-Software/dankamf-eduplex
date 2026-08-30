// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { logoutUser } from '../firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();
const ADMIN_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const idleTimerRef = useRef(null);

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

  // Automatically sign administrators out after a period of inactivity.
  // This is intentionally scoped to admin roles; public users are not given
  // an authenticated session by this provider.
  useEffect(() => {
    if (!currentUser || !['admin', 'superadmin'].includes(userRole)) return undefined;

    let lastActivityAt = Date.now();
    const clearIdleTimer = () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
    const scheduleLogout = () => {
      clearIdleTimer();
      idleTimerRef.current = window.setTimeout(async () => {
        if (Date.now() - lastActivityAt >= ADMIN_IDLE_TIMEOUT_MS) {
          try {
            await logoutUser();
          } catch (error) {
            console.error('Automatic logout error:', error);
          }
        } else {
          scheduleLogout();
        }
      }, ADMIN_IDLE_TIMEOUT_MS);
    };
    const recordActivity = () => {
      lastActivityAt = Date.now();
      scheduleLogout();
    };

    ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });
    scheduleLogout();

    return () => {
      clearIdleTimer();
      ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
    };
  }, [currentUser, userRole]);

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
