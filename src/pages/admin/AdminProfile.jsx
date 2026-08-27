import React, { useEffect, useState } from 'react';
import { getAuth, multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator, RecaptchaVerifier, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { requireRecentAdminAuth } from '../../firebase/security';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';

export default function AdminProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    photo: null,
    photoUrl: '',
  });
  const [msg, setMsg] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [mfaBusy, setMfaBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setForm((f) => ({
          ...f,
          displayName: data.displayName || user.displayName || '',
          bio: data.bio || '',
          photoUrl: data.photoUrl || user.photoURL || '',
        }));
      }
    })();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') setForm({ ...form, photo: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      let newPhotoUrl = form.photoUrl;

      if (form.photo) {
        const imgRef = ref(storage, `profileImages/${user.uid}/${Date.now()}-${form.photo.name}`);
        const snap = await uploadBytes(imgRef, form.photo);
        newPhotoUrl = await getDownloadURL(snap.ref);
      }

      await updateProfile(user, {
        displayName: form.displayName,
        photoURL: newPhotoUrl,
      });

      await setDoc(
        doc(db, 'users', user.uid),
        {
          displayName: form.displayName,
          bio: form.bio,
          photoUrl: newPhotoUrl,
        },
        { merge: true }
      );

      setMsg('✅ Profile updated!');
      setForm({ ...form, photo: null, photoUrl: newPhotoUrl });
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  const startMfaEnrollment = async () => {
    setMfaBusy(true); setMsg('');
    try {
      await requireRecentAdminAuth(confirmPassword);
      if (!phone.trim()) throw new Error('Enter the superadmin phone number in international format, for example +233XXXXXXXXX.');
      const verifier = new RecaptchaVerifier(auth, 'mfa-recaptcha-container', { size: 'invisible' });
      const session = await multiFactor(user).getSession();
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber({ phoneNumber: phone.trim(), session }, verifier);
      setVerificationId(id); setMsg('Verification code sent. Enter the SMS code to finish MFA setup.');
    } catch (error) { console.error(error); setMsg(error.message || 'Unable to send MFA verification code.'); } finally { setMfaBusy(false); }
  };

  const finishMfaEnrollment = async (event) => {
    event.preventDefault(); setMfaBusy(true); setMsg('');
    try {
      if (!verificationCode.trim()) throw new Error('Enter the SMS verification code.');
      const assertion = PhoneMultiFactorGenerator.assertion(verificationId, verificationCode.trim());
      await multiFactor(user).enroll(assertion, 'Dankamf superadmin phone');
      setVerificationId(''); setVerificationCode(''); setPhone(''); setMsg('MFA enabled successfully for this superadmin account.');
    } catch (error) { console.error(error); setMsg(error.message || 'Unable to complete MFA setup.'); } finally { setMfaBusy(false); }
  };

  return (
    <AdminLayout>
      <>
        <PageTitle>👤 My Profile</PageTitle>
        {msg && <p className="mb-4 text-gray-700 dark:text-gray-300">{msg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-white dark:bg-gray-900 p-6 rounded shadow">
          {form.photoUrl && (
            <img src={form.photoUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
          )}

          <input
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            placeholder="Display Name"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded h-24 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />

          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-100"
          />

          <label className="block text-sm font-bold text-gray-700 dark:text-gray-200">Confirm password to save<input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="current-password" className="mt-1 w-full rounded border border-gray-300 bg-white p-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white" /></label>
          <button className="bg-primary text-white px-6 py-3 rounded hover:bg-cta transition">
            Save Profile
          </button>
        </form>
        <section className="mt-6 max-w-md rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-black text-primary dark:text-sky-300">Superadmin MFA</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Add a phone number to require an SMS code when signing in from a new device.</p>
          {!verificationId ? <div className="mt-4 space-y-3"><label className="block text-sm font-bold text-slate-700 dark:text-slate-200">Phone number<input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+233XXXXXXXXX" className="mt-1 w-full rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label><div id="mfa-recaptcha-container" /><button type="button" disabled={mfaBusy} onClick={startMfaEnrollment} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{mfaBusy ? 'Sending code…' : 'Send MFA code'}</button></div> : <form onSubmit={finishMfaEnrollment} className="mt-4 space-y-3"><label className="block text-sm font-bold text-slate-700 dark:text-slate-200">SMS verification code<input value={verificationCode} onChange={(event) => setVerificationCode(event.target.value)} inputMode="numeric" autoComplete="one-time-code" className="mt-1 w-full rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" /></label><button disabled={mfaBusy} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{mfaBusy ? 'Verifying…' : 'Enable MFA'}</button></form>}
        </section>
      </>
    </AdminLayout>
  );
}
