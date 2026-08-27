import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from './config';

/** Require a recent password confirmation before a sensitive admin action. */
export async function requireRecentAdminAuth(password) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('Your administrator session has expired. Please sign in again.');
  if (!password) throw new Error('Enter your administrator password to confirm this sensitive action.');
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
}
