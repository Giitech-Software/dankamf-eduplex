// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { getMultiFactorResolver, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loginUser, logoutUser, sendVerificationEmail } from '../firebase/auth';
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
  const [mfaResolver, setMfaResolver] = useState(null);
  const [mfaVerificationId, setMfaVerificationId] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle state
  const { currentUser, isAdmin } = useAuth(); // ✅ Get auth state

  // If an admin is already logged in, redirect them to the dashboard.
  useEffect(() => {
    if (currentUser && isAdmin && currentUser.emailVerified) {
      // The dashboard route is registered at /dashboard. Keep the fallback
      // aligned with App.js so a successful login never lands on a 404 page.
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [currentUser, isAdmin, navigate, location.state]);

  useEffect(() => {
    if (location.state?.emailVerificationRequired) setError('Please verify your administrator email before accessing the dashboard.');
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(''); // Reset error on new submission

    try {
      const user = await loginUser(form.email, form.password);
      if (!user.emailVerified) {
        await sendVerificationEmail(user);
        await logoutUser();
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      toast.success('Login successful! Redirecting...');
      // The useEffect above will handle the redirect automatically.
    } catch (err) {
      console.error(err);
      const errorMessages = {
        'auth/invalid-credential': 'The email or password is incorrect. Please check your details and try again.',
        'auth/user-not-found': 'No administrator account was found with this email address.',
        'auth/wrong-password': 'The password is incorrect. Please try again.',
        'auth/user-disabled': 'This administrator account has been disabled. Please contact the superadmin.',
        'auth/too-many-requests': 'Too many unsuccessful attempts. Please wait a few minutes and try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      if (err.code === 'auth/multi-factor-auth-required') {
        try {
          const resolver = getMultiFactorResolver(auth, err);
          const verifier = new RecaptchaVerifier(auth, 'login-mfa-recaptcha', { size: 'invisible' });
          const provider = new PhoneAuthProvider(auth);
          const id = await provider.verifyPhoneNumber({ multiFactorHint: resolver.hints[0], session: resolver.session }, verifier);
          setMfaResolver(resolver); setMfaVerificationId(id); setError('A verification code was sent to your enrolled phone.');
        } catch (mfaError) { console.error(mfaError); setError('We could not start MFA verification. Please try again.'); }
        return;
      }
      const errorMessage = err.message === 'EMAIL_NOT_VERIFIED'
        ? 'Your email is not verified. A verification link has been sent. Verify it, then sign in again.'
        : errorMessages[err.code] || 'We could not sign you in right now. Please try again.';
      if (err.code === 'auth/network-request-failed' || !navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await mfaResolver.resolveSignIn(PhoneMultiFactorGenerator.assertion(mfaVerificationId, mfaCode.trim())); toast.success('MFA verified. Redirecting…'); }
    catch (err) { console.error(err); setError('The MFA code is invalid or expired. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <Seo title="Admin Login" description="Admin login page for Dankamf Eduplex" />
      <div className="login-shell flex min-h-screen items-center justify-center overflow-y-auto px-4 py-5 sm:py-8">
        <form
          onSubmit={mfaResolver ? handleMfaSubmit : handleSubmit}
          className="w-full min-w-0 max-w-[21rem] space-y-2 rounded-2xl border border-sky-100 bg-white p-3 shadow-2xl shadow-slate-950/20 sm:p-4"
        >
          <div className="text-center">
            <img className="mx-auto h-24 w-24 rounded-full bg-white p-2 object-contain" src={logo} alt="Dankamf Eduplex" />
            <h2 className="mt-2 text-lg font-black tracking-tight text-[#003153] sm:text-xl">
              Administrator Access
            </h2>
          </div>

          <label className="block min-w-0 space-y-1"><span className="text-xs font-bold uppercase tracking-wide text-slate-600">Email address</span><input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="block w-full max-w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#007BA7] focus:bg-white focus:ring-2 focus:ring-[#007BA7]/20"
            required
          /></label>

          {/* ✅ Password Input Container */}
          <label className="block min-w-0 space-y-1"><span className="text-xs font-bold uppercase tracking-wide text-slate-600">Password</span><div className="relative min-w-0">
            <input
              type={showPassword ? 'text' : 'password'} // ✅ Dynamic type
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="block w-full max-w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#007BA7] focus:bg-white focus:ring-2 focus:ring-[#007BA7]/20"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:bg-sky-50 hover:text-[#007BA7]"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div></label>

          {mfaResolver && <><label className="block space-y-1 text-xs font-bold uppercase tracking-wide text-slate-600">SMS verification code<input value={mfaCode} onChange={(event) => setMfaCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" required className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#007BA7] focus:ring-2 focus:ring-[#007BA7]/20" /></label><div id="login-mfa-recaptcha" /></>}
          <button
            type="submit"
            disabled={loading}
            className="w-full justify-center rounded-lg bg-gradient-to-r from-[#003153] to-[#007BA7] px-4 py-2 text-sm font-black text-white shadow-lg shadow-sky-900/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Verifying...' : mfaResolver ? 'Verify and Continue' : 'Sign In'}
          </button>

          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

          <Link
            to="/"
            className="mx-auto inline-flex items-center justify-center rounded-full border border-cobalt/30 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition hover:border-cobalt hover:bg-blue-50 hover:underline dark:border-sky-300/40 dark:text-primary"
          >
            ← Back to Homepage
          </Link>
        </form>
      </div>
    </>
  );
}
