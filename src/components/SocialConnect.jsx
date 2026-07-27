import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const links = [
  ['Facebook', 'https://facebook.com', <FaFacebook />],
  ['Instagram', 'https://instagram.com', <FaInstagram />],
  ['X', 'https://x.com', <FaXTwitter />],
  ['TikTok', 'https://www.tiktok.com', <FaTiktok />],
  ['WhatsApp', 'https://wa.me/233551234567', <FaWhatsapp />],
];

export default function SocialConnect() {
  return <section className="bg-primary-dark px-4 py-12 text-center text-white sm:px-8"><div className="mx-auto max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-accent-yellow">Stay Connected</p><h2 className="mt-2 text-3xl font-black">Follow the Dankamf Community</h2><p className="mt-3 text-slate-300">Keep up with school news, achievements, activities, and announcements.</p><div className="mt-6 flex justify-center gap-3">{links.map(([label, href, icon]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow Dankamf on ${label}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-accent-yellow hover:text-darkgray">{icon}</a>)}</div></div></section>;
}
