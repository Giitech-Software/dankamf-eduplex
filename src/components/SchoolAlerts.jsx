import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { AlertTriangle, X } from 'lucide-react';
import { db } from '../firebase/config';

export default function SchoolAlerts() {
  const [alerts, setAlerts] = useState([]); const [dismissed, setDismissed] = useState([]);
  useEffect(() => { getDocs(query(collection(db, 'schoolAlerts'), where('active', '==', true), orderBy('createdAt', 'desc'), limit(3))).then((snap) => setAlerts(snap.docs.map((item) => ({ id: item.id, ...item.data() })))).catch(console.error); }, []);
  const visible = alerts.filter((alert) => !dismissed.includes(alert.id));
  if (!visible.length) return null;
  return <div className="space-y-2 bg-white px-4 pt-3 sm:px-8">{visible.map((alert) => <div key={alert.id} className={`mx-auto flex max-w-7xl items-start gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${alert.type === 'emergency' ? 'bg-red-600 text-white' : 'bg-blue-100 text-primary'}`} role="status"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><p className="flex-1"><span className="mr-2 font-black uppercase tracking-wider">{alert.type === 'emergency' ? 'Emergency' : 'School Alert'}</span>{alert.message}</p><button onClick={() => setDismissed((current) => [...current, alert.id])} aria-label="Dismiss alert"><X className="h-4 w-4" /></button></div>)}</div>;
}
