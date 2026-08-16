import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Topbar from './Topbar';

// Font Awesome Icons
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaWpforms,
  FaUserPlus,
  FaTools,
  FaBriefcase,
  FaScroll,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaPenNib,
  FaPlusCircle,
  FaRegNewspaper,
  FaHandshake,
  FaLayerGroup,
  FaQuoteLeft,
  FaEnvelope, FaImage
  , FaCalendarAlt, FaFileDownload, FaBell, FaUserTie, FaUniversity
} from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const { user, role, logout } = useAuth();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarScrollTop = useRef(0);

  const restoreSidebarScroll = (node) => {
    if (!node) return;
    const saved = Number(sessionStorage.getItem('dankamf-admin-sidebar-scroll') || 0);
    node.scrollTop = saved || sidebarScrollTop.current;
  };

  const saveSidebarScroll = (event) => {
    const value = event.currentTarget.scrollTop;
    sidebarScrollTop.current = value;
    sessionStorage.setItem('dankamf-admin-sidebar-scroll', String(value));
  };

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = open ? 'hidden' : 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sidebarVar = {
    hidden: { x: '-100%' },
    visible: { x: 0 },
  };

  const navLinkClass = ({ isActive }) => `flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[15px] leading-tight transition-colors ${isActive ? 'border-sky-200/40 bg-white/20 font-black text-white shadow-sm' : 'border-transparent text-sky-50 hover:border-white/15 hover:bg-white/10 hover:text-white'}`;
  const sectionClass = "pt-4 pb-1 text-[10px] uppercase text-sky-200/70 font-bold tracking-widest";

  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-3 shrink-0">
        <h2 className="pr-12 text-lg font-bold text-white">Dankamf Admin</h2>
        <p className="text-xs text-warm-amber font-medium tracking-wide">{role?.toUpperCase()}</p>
      </div>

      <nav ref={restoreSidebarScroll} onScroll={saveSidebarScroll} className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1.5 custom-scrollbar">
        <NavLink to="/dashboard" className={navLinkClass}><FaTachometerAlt /> Dashboard</NavLink>
        {role === 'superadmin' && <NavLink to="/admin/users" className={navLinkClass}><FaUsers /> Manage Users</NavLink>}
        <NavLink to="/admin/forms" className={navLinkClass}><FaWpforms /> Contact Forms</NavLink>
        <NavLink to="/admin/newsletter" className={navLinkClass}><FaEnvelope /> Newsletter</NavLink>
        <NavLink to="/admin/manage-events" className={navLinkClass}><FaCalendarAlt /> Manage Events</NavLink>
        <NavLink to="/admin/admissions" className={navLinkClass}><FaWpforms /> Admission Applications</NavLink>
        <NavLink to="/admin/downloads" className={navLinkClass}><FaFileDownload /> Download Center</NavLink>
        <NavLink to="/admin/alerts" className={navLinkClass}><FaBell /> School Alerts</NavLink>
        <NavLink to="/admin/leadership" className={navLinkClass}><FaUserTie /> Leadership Team</NavLink>
        <NavLink to="/admin/about" className={navLinkClass}><FaUniversity /> About &amp; School Profile</NavLink>
        <NavLink to="/admin/alumni" className={navLinkClass}><FaUsers /> Alumni Registrations</NavLink>
        <NavLink to="/admin/interviews" className={navLinkClass}><FaCalendarAlt /> Interview Requests</NavLink>
        <NavLink to="/admin/fees" className={navLinkClass}><FaScroll /> Admissions Fees</NavLink>
        {role === 'superadmin' && <NavLink to="/admin/add-user" className={navLinkClass}><FaUserPlus /> Add User</NavLink>}
        {role === 'superadmin' && <NavLink to="/admin/hero-images" className={navLinkClass}><FaBriefcase /> Hero Images</NavLink>}

        <div className={sectionClass}>Services & Projects</div>
        <NavLink to="/admin/manage-services" className={navLinkClass}><FaCog /> Manage Academic Programmes</NavLink>
        <NavLink to="/admin/enterprise-features" className={navLinkClass}><FaLayerGroup /> School Capabilities</NavLink>
        <NavLink to="/admin/client-testimonials" className={navLinkClass}><FaQuoteLeft /> Client Testimonials</NavLink>
        <NavLink to="/admin/add-project" className={navLinkClass}><FaBriefcase /> Add Campus Activity</NavLink>
        <NavLink to="/admin/manage-projects" className={navLinkClass}><FaCog /> Campus Activities</NavLink>
        <NavLink to="/admin/gallery" className={navLinkClass}><FaImage /> Gallery Manager</NavLink>
        
        <NavLink to="/admin/add-post" className={navLinkClass}><FaPenNib /> Add News Article</NavLink>
        <NavLink to="/admin/manage-posts" className={navLinkClass}><FaRegNewspaper /> Manage News &amp; Events</NavLink>
        <NavLink to="/admin/add-partner" className={navLinkClass}><FaHandshake /> Manage Partners</NavLink>

        <div className={sectionClass}>Support & Settings</div>
        <NavLink to="/admin/add-faq" className={navLinkClass}><FaPlusCircle /> Add FAQ</NavLink>
        <NavLink to="/admin/manage-faqs" className={navLinkClass}><FaTools /> Manage FAQs</NavLink>
        <NavLink to="/admin/activity-logs" className={navLinkClass}><FaScroll /> Activity Logs</NavLink>
        <NavLink to="/admin/jobs" className={navLinkClass}><FaBriefcase /> Manage Vacancies</NavLink>
        <NavLink to="/admin/profile" className={navLinkClass}><FaUserCircle /> My Profile</NavLink>
        <NavLink to="/admin/settings" className={navLinkClass}><FaCog /> Site Settings</NavLink>
      </nav>

      <div className="mt-3 shrink-0 border-t border-white/10 pt-3 text-xs text-gray-300">
        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-warm-terracotta px-3 py-1.5 text-sm text-white shadow-lg transition-colors hover:bg-red-700"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className={`admin-site flex min-h-screen min-w-0 overflow-x-hidden ${theme === 'dark' ? 'bg-[#071426] text-gray-100' : 'bg-[#f2f8fc] text-gray-900'}`}>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-prussian text-white fixed top-0 left-0 h-screen z-40 shadow-2xl">
        <div className="h-full px-5 pb-5 pt-[60px]">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile: Hamburger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        className="lg:hidden fixed top-3 left-4 z-[70] h-10 w-10 inline-flex items-center justify-center bg-prussian text-white rounded-md shadow-lg hover:bg-midnight transition-colors"
      >
        <FaBars size={20} />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[110] backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 z-[120] h-[100dvh] w-72 max-w-[85vw] bg-prussian text-white shadow-2xl overflow-hidden"
              variants={sidebarVar}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="relative h-full min-h-0 flex flex-col p-4">
                <div className="absolute right-4 top-3 z-10">
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close admin menu"
                    className="h-11 w-11 inline-flex items-center justify-center hover:bg-white/10 rounded-full text-white"
                  >
                    <FaTimes size={27} />
                  </button>
                </div>
                <div className="flex-1 min-h-0 pt-0">
                  <SidebarContent />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="min-w-0 flex-1 overflow-x-hidden pt-20 pb-6 px-4 sm:px-5 md:px-6 lg:pl-[280px] transition-all duration-300">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
