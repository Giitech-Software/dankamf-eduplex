import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const q = query(collection(db, 'faqs'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching FAQ preview:', error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section id="faqs" className="scroll-mt-20 bg-white px-0 py-10 text-text md:px-8">
      <h2 className="mb-4 px-4 text-center text-2xl font-bold text-primary sm:px-0 sm:text-4xl">
        Frequently Asked Questions
      </h2>

      <div className="mx-auto max-w-4xl space-y-3 px-4 sm:space-y-4 sm:px-0">
        {faqs.slice(0, 3).map(faq => (
          <div
            key={faq.id}
            className="rounded border-l-4 border-primary bg-gray-50 p-4 shadow"
          >
            <h3 className="text-xl font-semibold">{faq.question}</h3>
          </div>
        ))}
      </div>

      {faqs.length > 0 && (
        <div className="mt-8 px-4 text-center sm:px-0">
          <Link
            to="/faqs"
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-cta"
          >
                View All FAQs
          </Link>
        </div>
      )}
    </section>
  );
};

export default FAQSection;
