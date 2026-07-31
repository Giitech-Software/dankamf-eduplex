import React, { useEffect, useState } from 'react';
import { db, firebaseConfig } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLog';
import PageTitle from '../../components/PageTitle';
import AdminLayout from '../../components/AdminLayout';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { Eye, EyeOff } from 'lucide-react';

export default function AddUser() {
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' });
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error('Unable to load users:', error);
      setStatus('Unable to load existing users. Confirm superadmin permissions.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      // Use a secondary Auth instance so creating a user does not replace the
      // currently signed-in superadmin session.
      const secondaryApp = initializeApp(firebaseConfig, `user-creation-${Date.now()}`);
      const secondaryAuth = getAuth(secondaryApp);
      const userCred = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email,
        form.password
      );
      const userId = userCred.user.uid;

      try {
        await setDoc(doc(db, 'users', userId), { email: form.email, role: form.role, createdAt: new Date() });
      } catch (profileError) {
        throw new Error(`Auth account created, but Firestore profile failed (${profileError.code || profileError.message}). Confirm superadmin permissions.`);
      }

      await signOut(secondaryAuth);

      try {
        await logActivity(user, 'add_user', `Added user: ${form.email} (${form.role})`);
      } catch (activityError) {
        console.warn('User created, but activity log failed:', activityError);
      }
      setStatus('✅ User added successfully!');
      setForm({ email: '', password: '', role: 'admin' });
      fetchUsers();
    } catch (err) {
      console.error('❌ Error:', err.message);
      setStatus('❌ Failed to add user: ' + err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="p-0 max-w-3xl mx-auto">
        <PageTitle>➕ Add New User</PageTitle>

        {status && (
          <p className="mb-4 text-sm text-center text-green-700 dark:text-green-400">{status}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-white dark:bg-gray-900 p-5 rounded-lg shadow mb-6"
        >
          <input
            type="email"
            name="email"
            placeholder="User Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2.5 border rounded focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Temporary Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 bg-white p-2.5 pr-10 text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 transition hover:text-primary"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2.5 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded hover:bg-cta transition"
          >
            Add User
          </button>
        </form>

        <h2 className="text-xl font-bold text-primary mb-4">👥 Existing Users</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="border p-3 rounded shadow-sm flex justify-between items-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            >
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{u.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Role: {u.role}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(u.createdAt?.seconds * 1000).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
