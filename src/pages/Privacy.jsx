import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-gray-800">
    <h1 className="text-3xl font-extrabold text-primary mb-6">Privacy Policy</h1>
    <div className="prose prose-lg max-w-none">
      <p>
        Your privacy is important to us. At <strong>Dankamf Educational Complex</strong>, we are committed
        to protecting your personal information and ensuring transparency in how we handle your data.
        We only collect data that is necessary to deliver, improve, and personalize your experience
        with our school and its services.
      </p>
      <p>
        This may include your name, email, contact information, and student details, which are essential
        for admissions, communication, and school administration. We do not sell or rent your data
        to third parties. Your information is used strictly for official school purposes.
      </p>
      <p>
        We implement industry-standard security measures to safeguard your data and give you control
        over your personal information. You may request, modify, or delete your data at any time by
        contacting us through our official channels.
      </p>
      <p>
        By using our website, you consent to the collection and use of information in
        accordance with this privacy policy. We may update this policy periodically, and any
        significant changes will be communicated accordingly.
      </p>
      <p>
        Your trust is important to us. At Dankamf Educational Complex, we uphold privacy as a core principle of our
        operations and community engagement.
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

export default Privacy;
