// components/NewsletterSignup.jsx
import React, { useState } from 'react';
import { subscribeToNewsletter } from '../utils/newsletter';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      await subscribeToNewsletter(email, 'homepage');
      setEmail('');
      setStatus('success');
      setMessage('Thanks for subscribing!');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setStatus('error');
      setMessage('Subscription failed. Please try again.');
    }
  };

  return (
    <section className="mb-10 bg-accent px-4 py-6 text-center text-white sm:px-8 sm:py-7">
      <h3 className="mb-3 text-2xl font-bold text-white">Stay Informed</h3>
      <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-blue-50">
        Join our mailing list for school news, event announcements, and important updates.
      </p>
      <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4">
        <input
          type="email"
          name="newsletter-email"
          placeholder="Your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="w-full rounded-md px-4 py-3 text-text outline-none sm:flex-1 sm:py-2"
          required
          disabled={status === 'submitting'}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-full bg-accent-yellow px-4 py-2 text-sm font-semibold text-darkgray transition hover:bg-accent-yellow-dark disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p role="status" aria-live="polite" className={`mx-auto mt-3 max-w-md text-sm ${status === 'error' ? 'text-red-100' : 'text-white'}`}>
          {message}
        </p>
      )}
    </section>
  );
}
