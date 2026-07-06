import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import CollegeCard from '../components/CollegeCard';
import { colleges } from '../data/colleges';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const navigate = useNavigate();
  const wrapRef = useRef(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = colleges
      .filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        (c.coursesOffered || []).some(co => co.toLowerCase().includes(q))
      )
      .slice(0, 6);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
    setSelectedIdx(-1);
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/course/all?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      navigate(`/college/${suggestions[selectedIdx].id}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const selectSuggestion = (college) => {
    navigate(`/college/${college.id}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const featuredColleges = colleges.slice(0, 3);
  const topMBA = colleges.filter(c => c.category === 'MBA').slice(0, 3);
  const topBBA = colleges.filter(c => c.category === 'BBA').slice(0, 3);
  const topBCom = colleges.filter(c => c.category === 'B.Com').slice(0, 3);

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

          <form className="search-bar-wrap" onSubmit={handleSearch} ref={wrapRef}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search for colleges, courses, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              autoComplete="off"
            />
            <button type="submit" className="btn-primary search-btn">Search</button>
            {showSuggestions && (
              <div className="search-suggestions">
                {suggestions.map((c, i) => (
                  <div
                    key={c.id}
                    className={`suggestion-item ${i === selectedIdx ? 'selected' : ''}`}
                    onClick={() => selectSuggestion(c)}
                    onMouseEnter={() => setSelectedIdx(i)}
                  >
                    <span className="suggestion-name">{c.shortName}</span>
                    <span className="suggestion-cat">{c.category}</span>
                  </div>
                ))}
              </div>
            )}
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

      {/* Top B.Com */}
      <section className="section bg-secondary">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-2">Top B.Com Colleges</h2>
            <button className="btn-secondary" onClick={() => navigate('/course/B.Com')}>View All</button>
          </div>
          <div className="college-grid">
            {topBCom.map(college => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;