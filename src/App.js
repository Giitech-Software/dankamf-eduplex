import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AcademicProgramDetails from './pages/AcademicProgramDetails';

import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProject from './pages/admin/AddProject';
import ManagePosts from './pages/admin/ManagePosts';
import AddPost from './pages/admin/AddPost';
import EditPost from './pages/admin/EditPost';
import AddUser from './pages/admin/AddUser';
import Users from './pages/admin/Users';
import ContactForms from './pages/admin/ContactForms';
import ActivityLogs from './pages/admin/ActivityLogs';
import Jobs from './pages/Jobs';
import Careers from './pages/Careers';
import SchoolCapabilities from './pages/SchoolCapabilities';
import JobDetails from './pages/JobDetails';
import JobsAdmin from './pages/admin/JobsAdmin';
import AddJob from './pages/admin/AddJob';
import EditJob from './pages/admin/EditJob';
import EditService from './pages/admin/EditService';
import Settings from './pages/admin/Settings';
import AdminProfile from './pages/admin/AdminProfile';
import JobApplications from './pages/admin/JobApplications';
import About from './pages/About';
import ManageAbout from './pages/admin/ManageAbout';
import StaffDirectory from './pages/StaffDirectory';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import ClientConfidence from './pages/ClientConfidence';
import FAQs from './pages/FAQs';
import ManageServices from './pages/admin/ManageServices';
import AddService from './pages/admin/AddService';
import ManageEnterpriseFeatures from './pages/admin/ManageEnterpriseFeatures';
import ManageClientTestimonials from './pages/admin/ManageClientTestimonials';
import Newsletter from './pages/admin/Newsletter';

import ManageFAQs from './pages/admin/ManageFAQs';
import AddFAQ from './pages/admin/AddFAQ';
import EditFAQ from './pages/admin/EditFAQ';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import MainLayout from './components/MainLayout';
import ScrollToTop from './components/ScrollToTop';

import ManageProjects from './pages/admin/ManageProjects';
import EditProject from './pages/admin/EditProject';
import AddPartner from './pages/admin/AddPartner';
import AddEvent from './pages/admin/AddEvent';
import ManageEvents from './pages/admin/ManageEvents';
import EditEvent from './pages/admin/EditEvent';
import AdmissionApplication from './pages/AdmissionApplication';
import Admissions from './pages/admin/Admissions';
import Gallery from './pages/Gallery';
import ManageDownloads from './pages/admin/ManageDownloads';
import Search from './pages/Search';
import Downloads from './pages/Downloads';
import BookTour from './pages/BookTour';
import ManageAlerts from './pages/admin/ManageAlerts';
import ManageLeadership from './pages/admin/ManageLeadership';
import StudentLife from './pages/StudentLife';
import Alumni from './pages/Alumni';
import ManageAlumni from './pages/admin/ManageAlumni';
import InterviewBooking from './pages/InterviewBooking';
import InterviewRequests from './pages/admin/InterviewRequests';
import ManageFees from './pages/admin/ManageFees';
import Fees from './pages/Fees';
import AdmissionStatus from './pages/AdmissionStatus';
import ApplicationDocuments from './pages/admin/ApplicationDocuments';
import ManageHeroImages from './pages/admin/ManageHeroImages';
import ManageGallery from './pages/admin/ManageGallery';
import Calendar from './pages/Calendar';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>

          {/* Public pages wrapped with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/academics/:slug" element={<AcademicProgramDetails />} />
            {/* Academics is the canonical public programme directory. Keep the
                legacy Services URL as a safe compatibility redirect. */}
            <Route path="/academics" element={<Services />} />
            <Route path="/services" element={<Navigate to="/academics" replace />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/student-life" element={<StudentLife />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/search" element={<Search />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admissions" element={<Jobs />} />
            <Route path="/jobs" element={<Careers />} />
            <Route path="/careers" element={<Navigate to="/jobs" replace />} />
            <Route path="/school-capabilities" element={<SchoolCapabilities />} />
            <Route path="/admissions/apply" element={<AdmissionApplication />} />
            <Route path="/book-a-tour" element={<BookTour />} />
            <Route path="/admissions/interview" element={<InterviewBooking />} />
            <Route path="/admissions/status" element={<AdmissionStatus />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/admissions/fees" element={<Fees />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/admissions/:id" element={<JobDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/staff" element={<StaffDirectory />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/client-confidence" element={<ClientConfidence />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/admin/add-partner" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AddPartner /></ProtectedRoute>} />
          </Route>

          {/* Standalone login route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-project"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AddProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-post"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AddPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-post/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <EditPost />
              </ProtectedRoute>
            }
          />
<Route
  path="/admin/manage-posts"
  element={
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <ManagePosts />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/services"
  element={
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <AddService />
    </ProtectedRoute>
  }
/>
          <Route
            path="/admin/edit-service/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <EditService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-services"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <ManageServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enterprise-features"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <ManageEnterpriseFeatures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/client-testimonials"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <ManageClientTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/newsletter"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Newsletter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-event"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AddEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admissions"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Admissions />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/downloads" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ManageDownloads /></ProtectedRoute>} />
          <Route path="/admin/alerts" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ManageAlerts /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ManageGallery /></ProtectedRoute>} />
          <Route path="/admin/leadership" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ManageLeadership /></ProtectedRoute>} />
          <Route path="/admin/about" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ManageAbout /></ProtectedRoute>} />
          <Route path="/admin/alumni" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ManageAlumni /></ProtectedRoute>} />
          <Route path="/admin/interviews" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><InterviewRequests /></ProtectedRoute>} />
          <Route path="/admin/fees" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ManageFees /></ProtectedRoute>} />
          <Route path="/admin/admissions/:applicationId/documents" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ApplicationDocuments /></ProtectedRoute>} />
          <Route
            path="/admin/manage-events"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <ManageEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-event/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/forms"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <ContactForms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-logs"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <ActivityLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hero-images"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <ManageHeroImages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <JobsAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-job"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AddJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-job/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications/:jobId"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <JobApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <Navigate to="/admin/manage-posts" replace />
              </ProtectedRoute>
            }
          />
          

          {/* FAQ Management Routes */}
          <Route
            path="/admin/manage-faqs"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminLayout>
                  <ManageFAQs />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-faq"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminLayout>
                  <AddFAQ />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-faq/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminLayout>
                  <EditFAQ />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Project Management Routes */}
<Route
  path="/admin/manage-projects"
  element={
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <ManageProjects />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/edit-project/:id"
  element={
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <EditProject />
    </ProtectedRoute>
  }
/>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
