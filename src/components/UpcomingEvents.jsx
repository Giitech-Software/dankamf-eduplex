import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import LoadingSpinner from './LoadingSpinner';

const fallbackEvents = [];

export default function UpcomingEvents() {
  const [events, setEvents] = useState(fallbackEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const eventsQuery = query(
          collection(db, 'events'),
          where('published', '==', true),
          limit(20)
        );
        const snapshot = await getDocs(eventsQuery);
        const upcoming = snapshot.docs
          .map((event) => ({ id: event.id, ...event.data() }))
          .filter((event) => event.date >= today)
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 3);
        setEvents(upcoming);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section className="bg-background-alt px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent sm:text-sm">Stay Connected</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-darkgray sm:text-4xl">Upcoming Events</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-text-light">Important dates, activities, and opportunities for our school community.</p>
        </div>
        <div className="mt-8 text-center">
          <Link to="/calendar" className="inline-flex rounded-full border border-primary px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-white">
            View all events →
          </Link>
        </div>
        {loading ? <LoadingSpinner label="Loading upcoming events" /> : (
          <div className="grid gap-5 md:grid-cols-3">
            {events.map((event) => (
              <article key={event.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                {event.imageUrl && <img src={event.imageUrl} alt="" className="h-40 w-full object-cover" loading="lazy" decoding="async" />}
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">{event.category}</p>
                  <h3 className="mt-2 text-xl font-black text-primary">{event.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-light">{event.description}</p>
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm font-semibold text-darkgray">
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent" />{new Date(`${event.date}T${event.time || '00:00'}`).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: event.time ? 'short' : undefined })}</p>
                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" />{event.location}</p>
                  </div>
                  {event.registrationUrl && <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-accent-yellow px-4 py-2 text-xs font-bold text-darkgray hover:bg-accent-yellow-dark">Register for this event</a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
