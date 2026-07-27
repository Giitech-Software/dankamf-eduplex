import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FaEnvelope
  , FaCalendarAlt, FaFileDownload, FaBell, FaUserTie
} from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const { user, role, logout } = useAuth();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = open ? 'hidden' : 'auto';
    }
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

  const navLinkClass = "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm leading-tight hover:bg-white/10 hover:text-warm-amber transition-colors";
  const sectionClass = "pt-3 pb-1 text-[10px] uppercase text-gray-400 font-bold tracking-widest";

  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-3 shrink-0">
        <h2 className="text-lg font-bold text-white">Dankamf Admin</h2>
        <p className="text-xs text-warm-amber font-medium tracking-wide">{role?.toUpperCase()}</p>
      </div>

      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1.5 custom-scrollbar">
        <Link to="/dashboard" className={navLinkClass}><FaTachometerAlt /> Dashboard</Link>
        {role === 'superadmin' && <Link to="/admin/users" className={navLinkClass}><FaUsers /> Manage Users</Link>}
        <Link to="/admin/forms" className={navLinkClass}><FaWpforms /> Contact Forms</Link>
        <Link to="/admin/newsletter" className={navLinkClass}><FaEnvelope /> Newsletter</Link>
        <Link to="/admin/manage-events" className={navLinkClass}><FaCalendarAlt /> Manage Events</Link>
        <Link to="/admin/admissions" className={navLinkClass}><FaWpforms /> Admission Applications</Link>
        <Link to="/admin/downloads" className={navLinkClass}><FaFileDownload /> Download Center</Link>
        <Link to="/admin/alerts" className={navLinkClass}><FaBell /> School Alerts</Link>
        <Link to="/admin/leadership" className={navLinkClass}><FaUserTie /> Leadership Team</Link>
        <Link to="/admin/alumni" className={navLinkClass}><FaUsers /> Alumni Registrations</Link>
        <Link to="/admin/interviews" className={navLinkClass}><FaCalendarAlt /> Interview Requests</Link>
        <Link to="/admin/fees" className={navLinkClass}><FaScroll /> Admissions Fees</Link>
        {role === 'superadmin' && <Link to="/admin/add-user" className={navLinkClass}><FaUserPlus /> Add User</Link>}

        <div className={sectionClass}>Services & Projects</div>
        <Link to="/admin/services" className={navLinkClass}><FaTools /> Add Service</Link>
        <Link to="/admin/manage-services" className={navLinkClass}><FaCog /> Manage Services</Link>
        <Link to="/admin/enterprise-features" className={navLinkClass}><FaLayerGroup /> Enterprise Features</Link>
        <Link to="/admin/client-testimonials" className={navLinkClass}><FaQuoteLeft /> Client Testimonials</Link>
        <Link to="/admin/add-project" className={navLinkClass}><FaBriefcase /> Add Project</Link>
        <Link to="/admin/manage-projects" className={navLinkClass}><FaCog /> Manage Projects</Link>
        
        <Link to="/admin/add-post" className={navLinkClass}><FaPenNib /> Add Post</Link>
        <Link to="/admin/manage-posts" className={navLinkClass}><FaRegNewspaper /> Manage Posts</Link>
        <Link to="/admin/add-partner" className={navLinkClass}><FaHandshake /> Manage Partners</Link>

        <div className={sectionClass}>Support & Settings</div>
        <Link to="/admin/add-faq" className={navLinkClass}><FaPlusCircle /> Add FAQ</Link>
        <Link to="/admin/manage-faqs" className={navLinkClass}><FaTools /> Manage FAQs</Link>
        <Link to="/admin/activity-logs" className={navLinkClass}><FaScroll /> Activity Logs</Link>
        <Link to="/admin/jobs" className={navLinkClass}><FaBriefcase /> Manage Jobs</Link>
        <Link to="/admin/profile" className={navLinkClass}><FaUserCircle /> My Profile</Link>
        <Link to="/admin/settings" className={navLinkClass}><FaCog /> Site Settings</Link>
      </nav>

      <div className="mt-3 shrink-0 space-y-2 border-t border-white/10 pt-3 text-xs text-gray-300">
        <p className="opacity-70 truncate">
          Logged in as: <br /><span className="text-white font-medium">{user?.email}</span>
        </p>
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
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-primary text-white fixed top-0 left-0 h-screen z-40 shadow-2xl">
        <div className="h-full px-5 pb-5 pt-[76px]">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile: Hamburger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        className="lg:hidden fixed top-3 left-4 z-[70] h-10 w-10 inline-flex items-center justify-center bg-primary text-white rounded-md shadow-lg hover:bg-cta transition-colors"
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
              className="fixed top-0 left-0 z-[120] h-[100dvh] w-72 max-w-[85vw] bg-primary text-white shadow-2xl overflow-hidden"
              variants={sidebarVar}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="h-full min-h-0 flex flex-col p-4">
                <div className="mb-2 flex shrink-0 justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close admin menu"
                    className="h-9 w-9 inline-flex items-center justify-center hover:bg-white/10 rounded-full text-white"
                  >
                    <FaTimes size={22} />
                  </button>
                </div>
                <div className="flex-1 min-h-0">
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
        <main className="flex-1 pt-20 pb-6 px-4 sm:px-5 md:px-6 lg:pl-[280px] transition-all duration-300">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
