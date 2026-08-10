import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import { FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Blog = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!location.hash || posts.length === 0) return;

    const targetId = location.hash.slice(1);
    const postId = targetId.replace(/^post-/, '');
    const targetPost = posts.find(post => post.id === postId);

    if (targetPost) {
      setHighlightedPostId(targetPost.id);
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
      const timer = setTimeout(() => setHighlightedPostId(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [location.hash, posts]);

  return (
    <>
      <Seo {...SeoConfig.blog} />
      <div className="min-h-screen bg-white px-0 text-slate-900 sm:px-5 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <section className="bg-electric-blue px-4 py-6 text-primary text-center sm:px-8 sm:py-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cobalt">Stay Informed</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              News & Events
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-primary/80">Stay updated with the latest happenings, announcements, and stories from our school community.</p>
          </section>

          {loading ? (
            <LoadingSpinner label="Loading insights" />
          ) : posts.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-lg">
              <p className="text-slate-400 font-medium">No insights published yet.</p>
            </div>
          ) : (
          <div className="grid gap-3 px-4 sm:gap-6 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <BlogCard
                key={post.id}
                id={`post-${post.id}`}
                post={post}
                index={idx}
                onClick={setActivePost}
                className={highlightedPostId === post.id ? 'ring-4 ring-accent ring-offset-4' : ''}
              />
            ))}
          </div>
          )}
        </div>
      </div>

      {/* FULL-WIDTH BLOG MODAL OVERLAY */}
      {activePost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-2 backdrop-blur-md sm:p-4">
          <div className="relative flex max-h-[96svh] w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">

            <button
              onClick={() => setActivePost(null)}
              className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-warm text-slate-900 hover:text-white rounded-full transition-all z-50 shadow-xl border border-slate-100"
            >
              <FaTimes size={18} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              <div className="md:w-[30%] bg-slate-950 flex flex-col p-6 lg:p-8 justify-start border-r border-slate-800">
                <div className="mb-4">
                  <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                    {activePost.title}
                  </h2>
                </div>
              </div>

              <div className="md:w-[70%] overflow-y-auto bg-white flex flex-col">
                {activePost.image && (
                  <div className="w-full bg-slate-50 shrink-0 border-b border-slate-100 overflow-hidden">
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar md:max-h-[450px]">
                      <img src={activePost.image} className="w-full h-auto block" alt="" />
                    </div>
                  </div>
                )}

                <div className="p-6 lg:p-8 prose prose-slate max-w-none text-slate-700 leading-relaxed flex-1 prose-headings:text-slate-900">
                  <ReactMarkdown>{activePost.content}</ReactMarkdown>
                </div>

                <div className="border-t border-slate-100 p-5 lg:px-8 bg-slate-50/50">
                  <button
                    onClick={() => setActivePost(null)}
                    className="group w-full rounded-lg bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-warm sm:w-auto"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
