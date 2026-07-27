import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard'; // Uniform Component
import LoadingSpinner from './LoadingSpinner';

export default function ProjectsPreview() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // limit(6) ensures the homepage stays fast and uncongested
        const q = query(
          collection(db, 'projects'),
          orderBy('timestamp', 'desc'),
          limit(6)
        );
        const snap = await getDocs(q);

        const projectData = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.title && p.description);

        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching project preview:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="bg-white px-0 py-16 sm:px-5 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 px-4 sm:px-0 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Highlights of School Life
            </h2>
            <div className="w-16 h-1.5 bg-accent mt-3 rounded-full"></div>
            <p className="mt-3 text-text-light text-base">
              A glimpse into our vibrant events, activities, and student achievements.
            </p>
          </div>

          {/* Desktop "View All" link */}
          <Link
            to="/projects"
            className="hidden items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-accent transition-transform hover:translate-x-2 md:flex"
          >
            See All Activities &rarr;
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading featured work" />
        ) : projects.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-lg">
            <p className="text-slate-400 font-medium">Coming soon.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 px-4 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-3">
              {projects.map((p, index) => (
                <Link key={p.id} to={`/projects#project-${p.id}`}>
                  <ProjectCard
                    project={p}
                    index={index}
                    onClick={() => {}} // Click is handled by Link navigation
                  />
                </Link>
              ))}
            </div>

            {/* Mobile/Tablet "View All" Button */}
           {/* Mobile/Tablet "View All" Button */}
<div className="mt-8 px-4 text-center sm:px-0">
  <Link
    to="/projects"
    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-accent-yellow px-5 py-2.5 text-xs font-black uppercase tracking-widest text-darkgray transition-all duration-300 hover:-translate-y-1 hover:bg-accent-yellow-dark hover:shadow-xl sm:w-auto sm:px-6"
  >
    Explore All Activities &rarr;
  </Link>
</div>
          </>
        )}
      </div>
    </section>
  );
}
