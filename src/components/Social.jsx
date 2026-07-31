// src/components/Social.jsx
import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  {
    icon: <FaFacebook />,
    href: 'https://www.facebook.com/share/1Bp8KYhmvn/?mibextid=wwXIfr',
    label: 'Facebook',
  },
  {
    icon: <FaXTwitter />,
    href: 'https://x.com',
    label: 'X',
  },
  {
    icon: <FaInstagram />,
    href: 'https://www.instagram.com/dankamf_educational?utm_source=qr',
    label: 'Instagram',
  },
  {
    icon: <FaTiktok />,
    href: 'https://www.tiktok.com/@dankamf_16?_r=1&_t=ZS-98PLpmRODAu',
    label: 'TikTok',
  },
  {
    icon: <FaWhatsapp />,
    href: 'https://wa.me/233242172216?text=Hello%20Dankamf%20Eduplex%2C%20I%20would%20like%20to%20make%20an%20inquiry.',
    label: 'WhatsApp',
  },
];

export default function Social() {
  return (
    <div className="flex justify-center gap-4 mt-2">
      {socialLinks.map(({ icon, href, label }, idx) => (
        <a
          key={idx}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit our ${label}`}
          title={label}
          className="text-white text-xl hover:text-accent transition-colors duration-200"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
