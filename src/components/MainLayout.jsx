import React, { useState, useEffect } from "react";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import GuidedAssistant from "./GuidedAssistant";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const location = useLocation();
  const loadingLabel = location.pathname === '/' ? 'Loading homepage' : location.pathname.startsWith('/admin') ? 'Loading admin dashboard' : location.pathname.startsWith('/student-life') ? 'Loading school life' : location.pathname.startsWith('/gallery') ? 'Loading gallery' : location.pathname.startsWith('/about') ? 'Loading About page' : location.pathname.startsWith('/admissions') ? 'Loading admissions' : location.pathname.startsWith('/jobs') || location.pathname.startsWith('/careers') ? 'Loading vacancies' : 'Loading page';

  useEffect(() => {
    let shouldShowSplash = false;

    try {
      const alreadyVisited = localStorage.getItem("visited");
    if (!alreadyVisited) {
      localStorage.setItem("visited", "true");
      shouldShowSplash = true;
    } else if (location.pathname === "/") {
      shouldShowSplash = true;
    }
    } catch (err) {
      console.warn("localStorage not available:", err);
    }

    if (shouldShowSplash) {
      setLoading(true);
      setContentVisible(false);
      const removeTimer = setTimeout(() => {
        setLoading(false);
        window.setTimeout(() => setContentVisible(true), 30);
      }, 3300);
      return () => clearTimeout(removeTimer);
    } else {
      setLoading(false);
      setContentVisible(true);
    }
  }, [location.pathname]);

  return (
    <div className="public-site relative">
      {/* Actual homepage layout */}
      <div className={`transition-opacity duration-500 ease-out ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <PublicHeader />
        <main>
          <Outlet />
        </main>
        <PublicFooter />
      </div>
      <GuidedAssistant />

      {/* Splash overlay */}
      {loading && (
        <div
          className="loading-shell fixed inset-0 z-[100] flex flex-col items-center justify-center"
        >
          <img key={location.pathname} src={logo} alt="Dankamf Educational Complex Logo" className="h-36 w-36 rounded-full bg-white p-2 animate-pulse object-contain drop-shadow-xl sm:h-44 sm:w-44" />
          <p className="mt-5 text-sm font-black uppercase tracking-[0.22em] text-sky-100">{loadingLabel}</p>
        </div>
      )}
    </div>
  );
}
