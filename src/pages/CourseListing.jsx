import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import CollegeCard from '../components/CollegeCard';
import { colleges } from '../data/colleges';
import { SlidersHorizontal, X } from 'lucide-react';
import './CourseListing.css';

const getCategoryLabel = (cat) => {
  const labels = {
    Engineering: 'Engineering',
    MBA: 'MBA / PGDM',
    BBA: 'BBA',
    'B.Com': 'B.Com',
    Design: 'Design',
    Science: 'Science',
    Healthcare: 'Healthcare'
  };
  return labels[cat] || cat;
};

const searchableFields = (college, lowerQ) =>
  college.name.toLowerCase().includes(lowerQ) ||
  college.shortName.toLowerCase().includes(lowerQ) ||
  (college.coursesOffered || []).some(c => c.toLowerCase().includes(lowerQ)) ||
  (college.overview || '').toLowerCase().includes(lowerQ) ||
  (college.location || '').toLowerCase().includes(lowerQ);

const matchesFeeRange = (college, range) => {
  if (!range || range === 'any') return true;
  const fv = college.feeValue || 0;
  switch (range) {
    case 'under-5': return fv < 500000;
    case '5-10': return fv >= 500000 && fv <= 1000000;
    case 'above-10': return fv > 1000000;
    default: return true;
  }
};

const matchesAdmission = (college, mode) => {
  if (!mode || mode === 'any') return true;
  const am = (college.admissionMode || '').toLowerCase();
  switch (mode) {
    case 'entrance':
      return /cat|mat|xat|gmat|kcet|je|comedk|pgcet|nmat|snap|pessat|nucat|cuet|gate|iisat|aeee|neet|clat|amcat/i.test(am);
    case 'merit':
      return /merit|class\s*12|board/i.test(am);
    case 'direct':
      return /direct|management/i.test(am);
    default: return true;
  }
};

const CourseListing = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [feeRange, setFeeRange] = useState('any');
  const [admissionMode, setAdmissionMode] = useState('any');
  const [showFilters, setShowFilters] = useState(false);

  const categoryLabel = category && category !== 'all'
    ? getCategoryLabel(category)
    : 'All';

  useEffect(() => {
    let result = colleges;

    if (category && category !== 'all') {
      result = result.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (query) {
      const lowerQ = query.toLowerCase();
      result = result.filter(c => searchableFields(c, lowerQ));
    }

    result = result.filter(c => matchesFeeRange(c, feeRange));
    result = result.filter(c => matchesAdmission(c, admissionMode));

    setFilteredColleges(result);
  }, [category, query, feeRange, admissionMode]);

  const clearFilters = useCallback(() => {
    setFeeRange('any');
    setAdmissionMode('any');
  }, []);

  const hasActiveFilters = feeRange !== 'any' || admissionMode !== 'any';

  return (
    <div className="container section animate-fade-in course-listing-page">
      <div className="listing-header">
        <div>
          <h1 className="heading-2">Top {categoryLabel} Colleges in Bangalore</h1>
          <p className="body-text">Showing {filteredColleges.length} results</p>
        </div>
        <button
          className={`btn-secondary filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(s => !s)}
        >
          {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
          Filters
          {hasActiveFilters && <span className="filter-badge">{' '}&bull;{' '}</span>}
        </button>
      </div>

      <div className={`listing-content ${showFilters ? 'filters-visible' : ''}`}>
        <aside className={`filter-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="card filter-card">
            <h3 className="heading-3" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Filters</h3>
            <div className="filter-group">
              <label className="small-text font-semibold">Fees Range</label>
              <select
                className="filter-select"
                value={feeRange}
                onChange={e => setFeeRange(e.target.value)}
              >
                <option value="any">Any</option>
                <option value="under-5">Under ₹5 Lakhs</option>
                <option value="5-10">₹5 - ₹10 Lakhs</option>
                <option value="above-10">Above ₹10 Lakhs</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="small-text font-semibold">Admission Mode</label>
              <select
                className="filter-select"
                value={admissionMode}
                onChange={e => setAdmissionMode(e.target.value)}
              >
                <option value="any">Any</option>
                <option value="entrance">Entrance Exam</option>
                <option value="merit">Merit Based</option>
                <option value="direct">Direct / Management Quota</option>
              </select>
            </div>
            {hasActiveFilters && (
              <button className="btn-text" onClick={clearFilters} style={{ marginTop: '0.5rem' }}>
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <main className="college-grid">
          {filteredColleges.map(college => (
            <CollegeCard key={college.id} college={college} />
          ))}
          {filteredColleges.length === 0 && (
            <div className="empty-state">
              <p className="body-text">No colleges found matching your criteria.</p>
              {query && <p className="small-text" style={{ marginTop: '0.5rem' }}>Try a different search term or adjust your filters.</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseListing;
