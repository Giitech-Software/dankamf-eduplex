import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-gray-800">
    <h1 className="text-3xl font-extrabold text-primary mb-6">Terms of Service</h1>
    <div className="prose prose-lg max-w-none">
      <p>
        By accessing or using the website of <strong>Dankamf Educational Complex</strong>, you
        agree to abide by the terms and conditions outlined herein. These Terms of Service govern your
        use of our website and its content.
      </p>
      <p>
        The content provided on this website, including text, graphics, logos, and images, is for informational purposes only. You agree not to misuse our website, interfere with its operation, or violate any applicable laws.
      </p>
      <p>
        We strive to ensure the information on this website is accurate and up-to-date, but we make no guarantees of its completeness or correctness. Dankamf Educational Complex is not liable for any errors or omissions, or for any damages resulting from the use of this information.
      </p>
      <p>
        All content, branding, and intellectual property on the site remain the exclusive property of
        Dankamf Educational Complex unless otherwise stated. Unauthorized reproduction or redistribution is strictly
        prohibited.
      </p>
      <p>
        We reserve the right to update or modify these terms at any time. Continued use of the
        website after changes implies acceptance of the new terms.
      </p>
      <p>
        If you do not agree to any part of these Terms, please discontinue use of our website. Your
        understanding and cooperation are appreciated.
      </p>
    </div>

    <div className="mt-10">
      <Link
        to="/"
        className="inline-block bg-primary text-white px-5 py-2 rounded hover:bg-cta transition"
      >
      </Link>
    </div>
  </div>
);

export default Terms;
