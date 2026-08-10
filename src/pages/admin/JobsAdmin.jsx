import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function JobsAdmin() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'));
        const snap = await getDocs(q);

        const jobList = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const jobData = { id: docSnap.id, ...docSnap.data() };
            const appSnap = await getDocs(
              query(collection(db, 'applications'), where('jobId', '==', docSnap.id))
            );
            jobData.applicantCount = appSnap.size;
            return jobData;
          })
        );

        setJobs(jobList);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      await deleteDoc(doc(db, 'jobs', id));
      setJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <PageTitle>💼 Manage Vacancies</PageTitle>
        <Link
          to="/admin/add-job"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-cta transition"
        >
          ➕ Post New Job
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading jobs" />
      ) : jobs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No jobs posted yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-white dark:bg-gray-900 dark:border dark:border-gray-700 shadow rounded"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {job.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {job.location} · {job.type}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Status: {job.status}
              </p>

              <div className="flex gap-4 mt-2 flex-wrap">
                <button
                  onClick={() => navigate(`/admin/edit-job/${job.id}`)}
                  className="px-4 py-2 bg-secondary text-white rounded hover:opacity-90 transition"
                >
                  ✏️ Edit
                </button>
                <Link
                  to={`/admin/applications/${job.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  📄 View Applications ({job.applicantCount})
                </Link>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
