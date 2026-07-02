import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CollegeCard from '../components/CollegeCard';
import { colleges } from '../data/colleges';
import { SlidersHorizontal } from 'lucide-react';
import './CourseListing.css';

const CourseListing = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filteredColleges, setFilteredColleges] = useState([]);
  
  useEffect(() => {
    let result = colleges;
    
    // Filter by Category
    if (category === 'Engineering') {
      result = result.filter(c => c.category === 'Engineering');
    } else if (category === 'BBA') {
      result = result.filter(c => c.category === 'BBA');
    } else if (category === 'B.Com') {
      result = result.filter(c => c.category === 'B.Com');
    }

    // Filter by Search Query
    if (query) {
      const lowerQ = query.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lowerQ) || 
        c.shortName.toLowerCase().includes(lowerQ)
      );
    }
    
    setFilteredColleges(result);
  }, [category, query]);

  return (
    <div className="container section animate-fade-in course-listing-page">
      <div className="listing-header">
        <div>
          <h1 className="heading-2">Top {category} Colleges in Bangalore</h1>
          <p className="body-text">Showing {filteredColleges.length} results</p>
        </div>
        <button className="btn-secondary filter-btn">
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>

      <div className="listing-content">
        <aside className="filter-sidebar">
          <div className="card filter-card">
            <h3 className="heading-3" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Filters</h3>
            {/* Simple placeholder for filters */}
            <div className="filter-group">
              <label className="small-text font-semibold">Fees Range</label>
              <select className="filter-select">
                <option>Any</option>
                <option>Under ₹5 Lakhs</option>
                <option>₹5 - ₹10 Lakhs</option>
                <option>Above ₹10 Lakhs</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="small-text font-semibold">Admission Mode</label>
              <select className="filter-select">
                <option>Any</option>
                <option>Entrance Exam</option>
                <option>Merit Based</option>
                <option>Management Quota</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="college-grid">
          {filteredColleges.map(college => (
            <CollegeCard key={college.id} college={college} />
          ))}
          {filteredColleges.length === 0 && (
            <div className="empty-state">
              <p className="body-text">No colleges found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseListing;
