import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WifiLoader from './components/WifiLoader';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const CourseListing = lazy(() => import('./pages/CourseListing'));
const CollegeDetails = lazy(() => import('./pages/CollegeDetails'));
const Compare = lazy(() => import('./pages/Compare'));
const Favorites = lazy(() => import('./pages/Favorites'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<WifiLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/course/:category" element={<CourseListing />} />
              <Route path="/college/:id" element={<CollegeDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
