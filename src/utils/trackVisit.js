import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

const getPeriodKeys = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = date.getDay() || 7;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - dayOfWeek + 1);
  const week = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
  return { daily: `${year}-${month}-${day}`, weekly: week, monthly: `${year}-${month}`, yearly: String(year) };
};

export const trackSiteVisit = async () => {
  try {
    const visitRef = doc(db, 'siteStats', 'visits');
    const docSnap = await getDoc(visitRef);
    const periods = getPeriodKeys();

    if (docSnap.exists()) {
      // Increment the count by 1
      await updateDoc(visitRef, { count: increment(1) });
    } else {
      // If the document doesn't exist, create it with count = 1
      await setDoc(visitRef, {
        count: 1,
      });
    }

    await Promise.all(Object.entries(periods).map(async ([period, key]) => {
      const periodRef = doc(db, 'siteStats', 'visits', 'periods', `${period}_${key}`);
      const periodSnap = await getDoc(periodRef);
      if (periodSnap.exists()) {
        await updateDoc(periodRef, { count: increment(1) });
      } else {
        await setDoc(periodRef, { period, key, count: 1 });
      }
    }));
  } catch (error) {
    console.error('Error tracking site visit:', error);
  }
};
