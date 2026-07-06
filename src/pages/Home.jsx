import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import CollegeCard from '../components/CollegeCard';
import { colleges } from '../data/colleges';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For simplicity, redirect to Engineering with search query in state or just filter.
      // A more robust implementation would use query params. Let's just navigate to course for now.
      navigate(`/course/Engineering?q=${searchQuery}`);
    }
  };

  const featuredColleges = colleges.slice(0, 3); // RVCE, PESU, MSRIT (Top 3 B.Tech)
  const topMBA = colleges.filter(c => c.category === 'MBA').slice(0, 3);
  const topBBA = colleges.filter(c => c.category === 'BBA').slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <h1 className="heading-1 text-gradient hero-title">
            Discover Your Dream <br/> College in Bangalore
          </h1>
          <p className="body-text hero-subtitle">
            Explore the top Engineering, MBA, BBA, and B.Com colleges in Bangalore.
            Compare fees, placements, and rankings with our modern platform.
          </p>
          
          <form className="search-bar-wrap" onSubmit={handleSearch}>
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for colleges, courses, or locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary search-btn">Search</button>
          </form>
        </div>
      </section>

      {/* Featured B.Tech */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-2">Featured Engineering Colleges</h2>
            <button className="btn-secondary" onClick={() => navigate('/course/Engineering')}>View All</button>
          </div>
          <div className="college-grid">
            {featuredColleges.map(college => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* Top MBA */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-2">Top MBA / PGDM Colleges</h2>
            <button className="btn-secondary" onClick={() => navigate('/course/MBA')}>View All</button>
          </div>
          <div className="college-grid">
            {topMBA.map(college => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>

      {/* Top BBA */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-2">Top BBA Colleges</h2>
            <button className="btn-secondary" onClick={() => navigate('/course/BBA')}>View All</button>
          </div>
          <div className="college-grid">
            {topBBA.map(college => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
