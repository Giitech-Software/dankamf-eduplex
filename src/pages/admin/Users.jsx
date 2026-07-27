// src/pages/admin/Users.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import PageTitle from '../../components/PageTitle';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Users() {
  const { user, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUsers(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
      );
      await logActivity(user, 'update_role', `Changed role for ${uid} → ${newRole}`);
      setMsg('✅ Role updated');
    } catch (err) {
      console.error(err);
      setMsg('❌ ' + err.message);
    }
  };

  const toggleActive = async (uid, disabled) => {
    try {
      await updateDoc(doc(db, 'users', uid), { disabled: !disabled });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === uid ? { ...u, disabled: !disabled } : u
        )
      );
      await logActivity(
        user,
        'toggle_user',
        `${!disabled ? 'Disabled' : 'Enabled'} user ${uid}`
      );
    } catch (err) {
      console.error(err);
      setMsg('❌ ' + err.message);
    }
  };

  const handleDelete = async (uid) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers((prev) => prev.filter((u) => u.id !== uid));
      await logActivity(user, 'delete_user', `Deleted user ${uid}`);
      setMsg('✅ User deleted');
    } catch (err) {
      console.error(err);
      setMsg('❌ ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <>
        <PageTitle>👥 Manage Users</PageTitle>
      </>
      {msg && <p className="mb-4 text-sm text-green-600 dark:text-green-400">{msg}</p>}

      {loading ? (
        <LoadingSpinner label="Loading users" />
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  {role === 'superadmin' ? (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border p-1 rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
                    >
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                      <option value="editor">editor</option>
                    </select>
                  ) : (
                    u.role
                  )}
                </td>
                <td className="p-3">
                  {u.disabled ? (
                    <span className="text-red-600 dark:text-red-400">Disabled</span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">Active</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  {role === 'superadmin' && (
                    <>
                      <button
  onClick={() => toggleActive(u.id, u.disabled)}
  className="px-3 py-1 rounded bg-secondary text-black dark:text-white hover:opacity-90"
>
  {u.disabled ? 'Enable' : 'Disable'}
</button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </AdminLayout>
  );
}
