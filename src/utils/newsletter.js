import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function subscribeToNewsletter(email, source) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('Please enter your email address.');
  }

  await addDoc(collection(db, 'newsletterSubscribers'), {
    email: normalizedEmail,
    source,
    status: 'active',
    subscribedAt: serverTimestamp(),
  });
}
