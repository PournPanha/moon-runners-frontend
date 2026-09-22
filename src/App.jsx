import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Mission from './components/Mission';
import Schedule from './components/Schedule';
import SocialMedia from './components/SocialMedia';
import Gallery from './components/Gallery';
import Sponsorship from './components/Sponsorship';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// ============== Admin Path ==============

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (token && user) {
      setIsAdminLoggedIn(true);
      setAdminUser(JSON.parse(user));
    }
  }, []);

  const handleAdminLogin = (user) => {
    setIsAdminLoggedIn(true);
    setAdminUser(user);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
  };

  // Check if we're on admin route
  if (window.location.pathname === '/admin') {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminLayout user={adminUser} onLogout={handleAdminLogout} />;
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-night flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-moon/20 border-t-moon rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🌙</span>
            </div>
          </div>
          <p className="text-moon font-orbitron text-lg animate-pulse">Moon-Runners Club</p>
          <p className="text-gray-400 text-sm mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-night">
      <Navbar />
      <Hero />
      <About />
      <Mission />
      <Schedule />
      <SocialMedia />
      <Gallery />
      <Sponsorship />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}