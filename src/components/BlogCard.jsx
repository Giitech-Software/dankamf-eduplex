import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function BlogCard({ post, onClick, index, id, className = '' }) {
  return (
    <div
      id={id}
      onClick={() => onClick(post)}
      className={`group flex cursor-pointer flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:border-warm hover:shadow-xl sm:rounded-lg ${className}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {post.image && (
        <div className="relative h-52 w-full overflow-hidden bg-slate-100 sm:h-60">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm text-xs font-black uppercase text-slate-900">
            Article
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
        <h2 className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-warm sm:text-2xl">
          {post.title}
        </h2>
        
        <div className="prose prose-sm line-clamp-3 max-h-[5.5rem] flex-1 overflow-hidden text-base leading-relaxed text-slate-600 sm:prose-base">
          <ReactMarkdown>
            {post.content || 'Read the latest news and updates from Dankamf Educational Complex.'}
          </ReactMarkdown>
        </div>

        <div className="flex items-center pt-3 text-sm font-black uppercase tracking-[0.16em] text-warm transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          Read Article &rarr;
        </div>
      </div>
    </div>
  );
}
