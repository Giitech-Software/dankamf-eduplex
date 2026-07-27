import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

export default function Dashboard() {
  const { user, userRole, isSuperAdmin } = useAuth();

  const [stats, setStats] = useState({
    users: '...',
    projects: '...', // 2. Added projects to initial state
    posts: '...',
    contacts: '...',
    applications: '...',
    visits: '...',
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

        setStats({
          users: userSnap.size,
          projects: projectSnap.size,
          posts: postSnap.size,
          contacts: contactSnap.size,
          applications: totalApplications,
          visits: visitSnap.exists() ? visitSnap.data().count : 0,
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

          <StatCard label="📰 Blog Posts" value={stats.posts} accent="border-warm" />
          <StatCard label="📬 Contact Forms" value={stats.contacts} accent="border-warm-amber" />
          <StatCard label="📝 Applications" value={stats.applications} accent="border-warm-terracotta" />
          <StatCard label="📈 Site Visitors" value={stats.visits} accent="border-accent" />
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
