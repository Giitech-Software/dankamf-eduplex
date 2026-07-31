import React, { useState, useEffect } from "react";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import GuidedAssistant from "./GuidedAssistant";
import { Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2800); // time splash is visible
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <div className="public-site relative">
      {/* Actual homepage layout */}
      <div>
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
          className="loading-shell fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          <img
            key={location.pathname}
            src={logo}
            alt="Dankamf Eduplex Logo"
            className="h-36 w-36 animate-pulse object-contain drop-shadow-xl sm:h-44 sm:w-44"
          />
          <p className="mt-4 text-lg font-semibold text-primary animate-pulse tracking-wider">
            Dankamf Educational Complex
          </p>
        </div>
      )}
    </div>
  );
}
