import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppDispatch } from '../store/hooks'
import { restoreSession } from '../store/slices/authSlice'
import Navbar from '../shared/components/ui/Navbar'
import Footer from '../shared/components/ui/Footer'
import Hero from '../features/hero/Hero'
import About from '../features/about/About'
import Destinations from '../features/destinations/Destinations'
import Features from '../features/features/Features'
import Testimonials from '../features/testimonials/Testimonials'
import FlightSearch from '../features/search/FlightSearch'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import AdminPanel from '../features/admin/AdminPanel'
import ProtectedRoute from '../shared/components/ui/ProtectedRoute'

const LandingPage: React.FC = () => (
  <div className="flex flex-col w-full">
    <Hero />
    <About />
    <Destinations />
    <Features />
    <Testimonials />
    <Footer />
  </div>
)

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Router>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            fontSize: '14px',
            fontWeight: '600',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<FlightSearch />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'AIRLINE_STAFF']} />}>
          <Route path="/admin/*" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
