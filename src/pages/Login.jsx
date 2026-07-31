// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { loginUser } from '../firebase/auth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import { Eye, EyeOff } from 'lucide-react'; // ✅ Import icons
import { useAuth } from '../context/AuthContext'; // ✅ Import useAuth
import { toast } from 'react-hot-toast'; // ✅ Use react-hot-toast for consistency
import logo from '../assets/logo.png'; // ✅ Use the school logo

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle state
  const { currentUser, isAdmin } = useAuth(); // ✅ Get auth state

  // If an admin is already logged in, redirect them to the dashboard.
  useEffect(() => {
    if (currentUser && isAdmin) {
      // The dashboard route is registered at /dashboard. Keep the fallback
      // aligned with App.js so a successful login never lands on a 404 page.
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [currentUser, isAdmin, navigate, location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(''); // Reset error on new submission

    try {
      await loginUser(form.email, form.password);
      toast.success('Login successful! Redirecting...');
      // The useEffect above will handle the redirect automatically.
    } catch (err) {
      console.error(err);
      const errorMessage = err.code === 'auth/invalid-credential' 
        ? 'Invalid email or password.' 
        : 'An error occurred during login.';
      if (err.code === 'auth/network-request-failed' || !navigator.onLine) {
        toast.error('No internet connection. Please check your network.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title="Admin Login" description="Admin login page for Dankamf Eduplex" />
      <div className="login-shell flex min-h-screen items-center justify-center bg-white px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/10 sm:p-8"
        >
          <div className="text-center">
            <img className="mx-auto h-24 w-auto object-contain" src={logo} alt="Dankamf Eduplex" />
            <h2 className="mt-3 text-xl font-bold tracking-tight text-primary">
              Administrator Access
            </h2>
          </div>

          <label className="space-y-1.5"><span>Email address</span><input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border p-2.5 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary"
            required
          /></label>

          {/* ✅ Password Input Container */}
          <label className="space-y-1.5"><span>Password</span><div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} // ✅ Dynamic type
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border p-2.5 pr-10 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div></label>

          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <Link
            to="/"
            className="block pt-4 text-center text-sm text-slate-600 dark:text-slate-400 hover:underline"
          >
            ← Back to Homepage
          </Link>
        </form>
      </div>
    </>
  );
}
