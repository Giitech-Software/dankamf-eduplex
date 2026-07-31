import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const links = [
  ['Facebook', 'https://www.facebook.com/share/1Bp8KYhmvn/?mibextid=wwXIfr', <FaFacebook />],
  ['Instagram', 'https://www.instagram.com/dankamf_educational?utm_source=qr', <FaInstagram />],
  ['X', 'https://x.com', <FaXTwitter />],
  ['TikTok', 'https://www.tiktok.com/@dankamf_16?_r=1&_t=ZS-98PLpmRODAu', <FaTiktok />],
  ['WhatsApp', 'https://wa.me/233242172216', <FaWhatsapp />],
];

export default function SocialConnect() {
  return <section className="bg-prussian px-4 py-6 text-center text-white sm:px-8 sm:py-8"><div className="mx-auto max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-electric-blue">Stay Connected</p><h2 className="mt-2 text-3xl font-black">Follow the Dankamf Community</h2><p className="mt-3 text-slate-300">Keep up with school news, achievements, activities, and announcements.</p><div className="mt-4 flex justify-center gap-3">{links.map(([label, href, icon]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow Dankamf on ${label}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-3xl text-white transition hover:bg-electric-blue hover:text-prussian">{icon}</a>)}</div></div></section>;
}
