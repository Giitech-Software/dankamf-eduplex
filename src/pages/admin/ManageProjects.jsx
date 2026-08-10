// src/pages/admin/ManageProjects.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        toast.success("Project deleted");
        fetchProjects(); // Refresh the list
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Manage Campus Activities</h1>
        <Link to="/admin/add-project" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
          <FaPlus size={14} /> Add New Project
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading projects" />
        ) : (
        <>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-gray-800 border-b dark:border-gray-700">
              <th className="p-3 font-bold text-slate-600 dark:text-slate-300">Project Name</th>
              <th className="p-3 font-bold text-slate-600 dark:text-slate-300">Category</th>
              <th className="p-3 font-bold text-slate-600 dark:text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50">
                <td className="p-3 font-medium">{p.title || "Untitled Project"}</td>
                <td className="p-3 text-slate-500">{p.category || "General"}</td>
                <td className="p-3 text-right flex justify-end gap-3">
                  <Link to={`/admin/edit-project/${p.id}`} className="text-blue-500 hover:text-blue-700">
                    <FaEdit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="p-6 text-center text-slate-400">No projects found. Add your first one!</div>
        )}
        </>
        )}
      </div>
    </AdminLayout>
  );
}
