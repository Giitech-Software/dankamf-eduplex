import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import SeoConfig from '../config/SeoConfig';
import ProjectCard from '../components/ProjectCard'; // New Import
import LoadingSpinner from '../components/LoadingSpinner';

export default function Projects() {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [highlightedProjectId, setHighlightedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        const projectData = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.title && p.description);

        setProjects(projectData);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!location.hash || projects.length === 0) return;

    const targetId = location.hash.slice(1);
    const projectId = targetId.replace(/^project-/, '');
    const targetProject = projects.find(project => project.id === projectId);

    if (targetProject) {
      setHighlightedProjectId(targetProject.id);
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
      const timer = setTimeout(() => setHighlightedProjectId(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [location.hash, projects]);

  return (
    <>
      <Seo {...SeoConfig.projects} />
      <div className="min-h-screen bg-white px-0 py-8 text-slate-900 sm:px-5 lg:px-12">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8 px-4 text-left sm:px-0">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Vibrant School Life
              </h1>
              <div className="w-20 h-1.5 bg-warm mt-3 rounded-full"></div>
              <p className="mt-3 text-slate-600 text-base leading-relaxed">
                Explore the rich experiences of student life at Dankamf Educational Complex, from exciting clubs and sports to cultural events and academic competitions.
              </p>
            </div>

          </div>

          {loading ? (
            <LoadingSpinner label="Loading projects" />
          ) : projects.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-lg">
              <p className="text-slate-400 font-medium">School-life activities will be published soon.</p>
            </div>
          ) : (
            <div className="grid gap-3 px-4 sm:grid-cols-2 sm:gap-6 sm:px-0 lg:grid-cols-3">
              {projects.map((p, index) => (
                <ProjectCard
                  key={p.id}
                  id={`project-${p.id}`}
                  project={p}
                  index={index}
                  onClick={setActiveProject}
                  className={highlightedProjectId === p.id ? 'ring-4 ring-accent ring-offset-4' : ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* REFINED PROJECT MODAL OVERLAY */}
      {activeProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 p-2 backdrop-blur-md sm:p-4">
          <div className="relative flex max-h-[96svh] w-full max-w-7xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">

            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 p-3 bg-white/80 hover:bg-warm text-slate-900 hover:text-white rounded-full transition-all z-50 shadow-xl border border-slate-100"
            >
              <FaTimes size={18} />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">

              <div className="md:w-[30%] bg-slate-950 flex flex-col p-6 lg:p-8 justify-start border-r border-slate-800">
                <div className="mb-4">
                  <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                    {activeProject.title}
                  </h2>
                  {activeProject.category && (
                    <p className="text-warm font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">
                      {activeProject.category}
                    </p>
                  )}
                </div>
                <div className="w-12 h-1 bg-warm/30 rounded-full mb-4"></div>
              </div>

              <div className="md:w-[70%] overflow-y-auto bg-white flex flex-col">
                <div className="w-full bg-slate-50 shrink-0 border-b border-slate-100 overflow-hidden">
                  <div className="max-h-[240px] overflow-y-auto custom-scrollbar md:max-h-[450px]">
                    <img
                      src={activeProject.imageUrl}
                      className="w-full h-auto block"
                      alt={activeProject.title}
                    />
                  </div>
                </div>

                <div className="p-4 lg:p-6 prose prose-slate max-w-none text-slate-700 leading-relaxed flex-1 prose-headings:text-slate-900 prose-p:text-base">
                  <ReactMarkdown>{activeProject.description}</ReactMarkdown>
                </div>

                <div className="border-t border-slate-100 p-5 lg:px-8 flex flex-wrap gap-3 bg-slate-50/50">
                   {activeProject.link && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-warm sm:w-auto"
                    >
                      Launch App <FaExternalLinkAlt size={12} />
                    </a>
                   )}
                   <button
                    onClick={() => setActiveProject(null)}
                    className="group w-full rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-700 transition-all duration-300 hover:border-slate-900 hover:text-slate-900 sm:w-auto"
                   >
                      <span className="flex items-center gap-2">
                        <span className="transition-transform group-hover:-translate-x-1">&lt;-</span>
                        Back
                      </span>
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
