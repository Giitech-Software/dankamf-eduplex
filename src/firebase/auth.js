import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config'; // Import the initialized auth instance

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = () => {
  return signOut(auth);
};
