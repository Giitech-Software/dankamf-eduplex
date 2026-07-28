import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';
import LoadingSpinner from './LoadingSpinner';

export default function BlogPreview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching blog preview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="border-t border-slate-100 bg-slate-50/50 px-0 py-16 sm:px-5 lg:px-12">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex flex-col justify-between gap-4 px-4 sm:px-0 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              News & Events
            </h2>
            <div className="w-16 h-1.5 bg-accent mt-3 rounded-full"></div>
            <p className="mt-3 text-text-light text-base">
              Stay updated with the latest happenings, announcements, and stories from our school community.
            </p>
          </div>
          <Link to="/blog" className="hidden text-sm font-black uppercase tracking-[0.16em] text-accent transition-transform hover:translate-x-2 md:block">
            View All News &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading insights" />
        ) : (
        <div className="grid gap-3 px-4 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link key={post.id} to={`/blog#post-${post.id}`}>
              <BlogCard post={post} index={index} onClick={() => {}} />
            </Link>
          ))}
        </div>
        )}

        {!loading && (
        <div className="mt-8 px-4 text-center sm:px-0">
          <Link
            to="/blog"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-yellow px-4 py-2 text-xs font-black uppercase tracking-widest text-darkgray transition-all duration-300 hover:-translate-y-1 hover:bg-accent-yellow-dark hover:shadow-xl sm:w-auto"
          >
            Explore All News &rarr;
          </Link>
        </div>
        )}
      </div>
    </section>
  );
}
