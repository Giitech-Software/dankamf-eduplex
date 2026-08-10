import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

const periodKeys = (() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayOfWeek = date.getDay() || 7;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - dayOfWeek + 1);
  return { daily: `${year}-${month}-${day}`, weekly: `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`, monthly: `${year}-${month}`, yearly: String(year) };
})();

export default function Dashboard() {
  const { user, userRole, isSuperAdmin } = useAuth();

  const [stats, setStats] = useState({
    users: '...',
    projects: '...', // 2. Added projects to initial state
    posts: '...',
    contacts: '...',
    applications: '...',
    visits: { allTime: '...', daily: '...', weekly: '...', monthly: '...', yearly: '...' },
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // 3. Added projectSnap to the parallel fetch
        const results = await Promise.allSettled([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'projects')), 
          getDocs(collection(db, 'posts')),
          getDocs(collection(db, 'contactForms')),
          getDocs(collection(db, 'jobs')),
          getDoc(doc(db, 'siteStats', 'visits')),
          getDoc(doc(db, 'siteStats', 'visits', 'periods', `daily_${periodKeys.daily}`)),
          getDoc(doc(db, 'siteStats', 'visits', 'periods', `weekly_${periodKeys.weekly}`)),
          getDoc(doc(db, 'siteStats', 'visits', 'periods', `monthly_${periodKeys.monthly}`)),
          getDoc(doc(db, 'siteStats', 'visits', 'periods', `yearly_${periodKeys.yearly}`)),
        ]);

        const read = (index, fallback) => results[index].status === 'fulfilled' ? results[index].value : fallback;
        const userSnap = read(0, { size: 'Unavailable' });
        const projectSnap = read(1, { size: 'Unavailable' });
        const postSnap = read(2, { size: 'Unavailable' });
        const contactSnap = read(3, { size: 'Unavailable' });
        const jobSnap = read(4, { docs: [] });
        const visitSnap = read(5, { exists: () => false });

        let totalApplications = 0;
        for (const jobDoc of jobSnap.docs) {
          const appsSnap = await getDocs(collection(db, 'jobs', jobDoc.id, 'applications'));
          totalApplications += appsSnap.size;
        }

        const periodCount = (index) => results[index].status === 'fulfilled' && results[index].value.exists() ? results[index].value.data().count || 0 : 0;
        setStats({
          users: userSnap.size,
          projects: projectSnap.size,
          posts: postSnap.size,
          contacts: contactSnap.size,
          applications: totalApplications,
          visits: { allTime: visitSnap.exists() ? visitSnap.data().count : 0, daily: periodCount(6), weekly: periodCount(7), monthly: periodCount(8), yearly: periodCount(9) },
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <PageTitle>⚡ Welcome, {user?.email}</PageTitle>
          
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            You are logged in as{' '}
            <strong className="text-warm-terracotta dark:text-warm-amber">
              {userRole?.toUpperCase()}
            </strong>.
          </p>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          <StatCard label="👥 Total Users" value={stats.users} accent="border-primary" />

          <Link to="/admin/manage-projects" className="block transform hover:scale-[1.02] transition-transform duration-200">
            <StatCard label="💼 Manage Projects" value={stats.projects} accent="border-blue-500" />
          </Link>

          {isSuperAdmin && (
            <Link to="/admin/users" className="block transform hover:scale-[1.02] transition-transform duration-200">
              <StatCard label="🛡️ Manage Admins" value={<FaUserShield />} accent="border-red-500" />
            </Link>
          )}

          <StatCard label="📰 News Articles" value={stats.posts} accent="border-warm" />
          <StatCard label="📬 Contact Forms" value={stats.contacts} accent="border-warm-amber" />
          <StatCard label="📝 Applications" value={stats.applications} accent="border-warm-terracotta" />
          <div className="rounded-xl border-l-4 border-accent bg-white p-6 shadow-sm dark:bg-gray-800 sm:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Visitor Periods</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {Object.entries(stats.visits).map(([period, value]) => <div key={period} className="rounded-lg bg-slate-50 p-4 dark:bg-gray-700"><p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-300">{period === 'allTime' ? 'All-time' : period}</p><p className="mt-1 text-2xl font-black text-primary dark:text-white">{value}</p></div>)}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─────────── Reusable card component with Warm Accents ─────────── */
function StatCard({ label, value, accent }) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 ${accent} hover:shadow-md transition-all duration-300 h-full`}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
        {value}
      </p>
    </div>
  );
}
