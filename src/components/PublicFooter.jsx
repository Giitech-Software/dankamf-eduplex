import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToNewsletter } from '../utils/newsletter';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaWhatsapp,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  { icon: <FaFacebookF />, label: 'Facebook', url: 'https://facebook.com' },
  { icon: <FaXTwitter />, label: 'X', url: 'https://x.com' },
  { icon: <FaInstagram />, label: 'Instagram', url: 'https://instagram.com' },
  { icon: <FaLinkedin />, label: 'LinkedIn', url: 'https://linkedin.com' },
  { icon: <FaTiktok />, label: 'TikTok', url: 'https://tiktok.com' },
  {
    icon: <FaWhatsapp />,
    label: 'WhatsApp',
    url: 'https://wa.me/233551234567?text=Hello%20Dankamf%20Eduplex%2C%20I%20would%20like%20to%20make%20an%20inquiry.',
  },
];

const PublicFooter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      await subscribeToNewsletter(email, 'footer');
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
    <footer className="bg-primary text-white px-4 sm:px-6 py-8 mt-10 text-sm">
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold mb-1">Dankamf Eduplex</h3>
          <p className="text-accent mb-4">Changing lives through Godly principles and quality education</p>
          <div className="space-y-1 text-xs">
            <p><strong>Location:</strong> Oyibi–Accra, near SDA Church</p>
            <p><strong>Hours:</strong> Mon - Fri, 7:00 AM - 3:00 PM</p>
            <p><strong>Email:</strong> info@dankamfeducationalcomplex.com</p>
            <p className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-accent" />
              <a
                href="https://maps.google.com/?q=Dankamf+Educational+Complex,+Accra,+Ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-white"
              >
                View on Google Maps
              </a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-accent">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
          <ul className="space-y-1">
            {socialLinks.map(({ icon, label, url }) => (
              <li key={label}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-accent"
                >
                  {icon} {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Newsletter</h4>
          <p className="text-sm mb-3">Get updates straight to your inbox.</p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              name="newsletter-email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="px-3 py-2 w-full text-black rounded text-sm"
              required
              disabled={status === 'submitting'}
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-70 w-full sm:w-auto"
            >
              {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
            </button>
            {message && (
              <p role="status" aria-live="polite" className={status === 'error' ? 'text-red-200' : 'text-green-200'}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="mt-6 border-t border-white/20 pt-4 text-center text-xs px-4">
        <span>&copy; {new Date().getFullYear()} Dankamf Educational Complex. All rights reserved.</span>
        <span className="mx-2 text-white/50" aria-hidden="true">|</span>
        <span>Powered by ASTEM Software Lab</span>
      </div>
    </footer>
  );
};

export default PublicFooter;
