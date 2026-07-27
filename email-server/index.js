const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const app = express();
const db = admin.firestore();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed.'));
  },
}));
app.use(express.json({ limit: '100kb' }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function requireAdmin(req, res, next) {
  try {
    const authorization = req.get('authorization') || '';
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });

    const decodedToken = await admin.auth().verifyIdToken(authorization.slice(7));
    const userSnapshot = await db.collection('users').doc(decodedToken.uid).get();
    const role = userSnapshot.data()?.role;
    if (!['admin', 'super_admin'].includes(role)) return res.status(403).json({ error: 'Admin access required.' });

    req.adminUser = decodedToken;
    return next();
  } catch (error) {
    console.error('Admin authentication failed:', error);
    return res.status(401).json({ error: 'Invalid or expired login.' });
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/admissions/status', async (req, res) => {
  const reference = typeof req.body.reference === 'string' ? req.body.reference.trim().toUpperCase() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!/^DKE-2026-[A-Z0-9]{6}$/.test(reference) || !email || email.length > 160) {
    return res.status(400).json({ error: 'Enter a valid application reference and email address.' });
  }
  try {
    const snapshot = await db.collection('admissionApplications')
      .where('applicationReference', '==', reference)
      .where('email', '==', email)
      .limit(1)
      .get();
    if (snapshot.empty) return res.status(404).json({ error: 'No matching application was found.' });
    const data = snapshot.docs[0].data();
    return res.json({ reference, status: data.status || 'new', programme: data.program || '', studentName: data.studentName || '' });
  } catch (error) {
    console.error('Admission status lookup failed:', error);
    return res.status(500).json({ error: 'Status lookup is temporarily unavailable.' });
  }
});

app.post('/api/newsletters/send', requireAdmin, async (req, res) => {
  const subject = typeof req.body.subject === 'string' ? req.body.subject.trim() : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

  if (!subject || subject.length > 150) return res.status(400).json({ error: 'A valid subject is required.' });
  if (!message || message.length > 20000) return res.status(400).json({ error: 'A valid message is required.' });

  try {
    const snapshot = await db.collection('newsletterSubscribers').where('status', '==', 'active').get();
    const recipients = [...new Set(snapshot.docs.map((item) => item.data().email).filter(Boolean))];
    if (recipients.length === 0) return res.status(400).json({ error: 'There are no active subscribers.' });

    const campaign = await db.collection('newsletterCampaigns').add({
      subject,
      message,
      recipientCount: recipients.length,
      status: 'sending',
      sentBy: req.adminUser.email || req.adminUser.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const chunks = [];
    for (let index = 0; index < recipients.length; index += 50) chunks.push(recipients.slice(index, index + 50));

    for (const bcc of chunks) {
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_FROM,
        bcc,
        subject,
        text: message,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>`,
      });
    }

    await campaign.update({ status: 'sent', sentAt: admin.firestore.FieldValue.serverTimestamp() });
    return res.json({ recipientCount: recipients.length });
  } catch (error) {
    console.error('Newsletter delivery failed:', error);
    return res.status(500).json({ error: 'Newsletter delivery failed. Check the email server configuration.' });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`Email server listening on port ${port}`));
