import React, { useCallback, useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import AdminLayout from '../../components/AdminLayout';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';

const emailServerUrl = process.env.REACT_APP_EMAIL_SERVER_URL;

export default function Newsletter() {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const loadNewsletterData = useCallback(async () => {
    try {
      const [subscriberSnapshot, campaignSnapshot] = await Promise.all([
        getDocs(collection(db, 'newsletterSubscribers')),
        getDocs(query(collection(db, 'newsletterCampaigns'), orderBy('sentAt', 'desc'))),
      ]);

      setSubscriberCount(
        subscriberSnapshot.docs.filter((item) => item.data().status === 'active').length
      );
      setCampaigns(campaignSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    } catch (error) {
      console.error('Failed to load newsletter data:', error);
      setNotice({ type: 'error', text: 'Could not load newsletter information.' });
    }
  }, []);

  useEffect(() => {
    loadNewsletterData();
  }, [loadNewsletterData]);

  const handleSend = async (event) => {
    event.preventDefault();
    setNotice({ type: '', text: '' });

    if (!emailServerUrl) {
      setNotice({
        type: 'error',
        text: 'Email server URL is not configured. Set REACT_APP_EMAIL_SERVER_URL before building.',
      });
      return;
    }

    if (subscriberCount === 0) {
      setNotice({ type: 'error', text: 'There are no active subscribers to email.' });
      return;
    }

    if (!window.confirm(`Send this newsletter to ${subscriberCount} active subscriber(s)?`)) return;

    setSending(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${emailServerUrl.replace(/\/$/, '')}/api/newsletters/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject: subject.trim(), message: message.trim() }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Newsletter could not be sent.');

      setSubject('');
      setMessage('');
      setNotice({ type: 'success', text: `Newsletter sent to ${result.recipientCount} subscriber(s).` });
      await loadNewsletterData();
    } catch (error) {
      console.error('Newsletter send failed:', error);
      setNotice({ type: 'error', text: error.message || 'Newsletter could not be sent.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <PageTitle>Newsletter</PageTitle>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Compose an email for {subscriberCount} active subscriber{subscriberCount === 1 ? '' : 's'}.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <form onSubmit={handleSend} className="space-y-5 rounded-lg bg-white p-5 shadow dark:bg-gray-900 sm:p-6">
          <div>
            <label htmlFor="newsletter-subject" className="mb-1 block text-sm font-semibold">Subject</label>
            <input
              id="newsletter-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={150}
              required
              disabled={sending}
              placeholder="Newsletter subject"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="newsletter-message" className="mb-1 block text-sm font-semibold">Message</label>
            <textarea
              id="newsletter-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={20000}
              required
              disabled={sending}
              rows={14}
              placeholder="Write the newsletter content..."
              className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {notice.text && (
            <p role="status" className={`rounded-md px-3 py-2 text-sm ${notice.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notice.text}
            </p>
          )}

          <button
            type="submit"
            disabled={sending || subscriberCount === 0}
            className="rounded-md bg-primary px-5 py-2.5 font-semibold text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? 'Sending newsletter...' : `Send to ${subscriberCount} subscriber${subscriberCount === 1 ? '' : 's'}`}
          </button>
        </form>

        <section className="rounded-lg bg-white p-5 shadow dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold">Recent campaigns</h3>
          {campaigns.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No newsletters have been sent yet.</p>
          ) : (
            <ul className="space-y-3">
              {campaigns.slice(0, 10).map((campaign) => (
                <li key={campaign.id} className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
                  <p className="font-medium">{campaign.subject}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {campaign.recipientCount} recipients · {campaign.sentAt?.toDate?.().toLocaleString() || 'Sending'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
