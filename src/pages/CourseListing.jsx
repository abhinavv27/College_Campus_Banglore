import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CollegeCard from '../components/CollegeCard';
import { colleges } from '../data/colleges';
import { SlidersHorizontal, X, Search } from 'lucide-react';
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

const getZone = (location) => {
  if (!location) return null;
  const loc = location.toLowerCase();
  if (/north|yelahanka|msr nagar|yeshwanthpur|peenya|mathikere|kengeri|devanahalli/.test(loc)) return 'North';
  if (/south|kumaraswamy|banashankari|jp nagar|btm|electronic city|hosur/.test(loc)) return 'South';
  if (/east|kr puram|whitefield|hoodi/.test(loc)) return 'East';
  if (/west|mysore road|vijayanagar|rajajinagar/.test(loc)) return 'West';
  if (/basavanagudi|vasanth|malleswaram|palace road|lalbagh|richmond|koramangala|shivajinagar/.test(loc)) return 'Central';
  return null;
};

const extractNirfNum = (rank) => {
  if (!rank) return Infinity;
  const m = String(rank).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Infinity;
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
  const query = searchParams.get('q') || '';

  const [filteredColleges, setFilteredColleges] = useState([]);
  const [feeRange, setFeeRange] = useState('any');
  const [admissionMode, setAdmissionMode] = useState('any');
  const [courseQuery, setCourseQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('any');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const categoryLabel = category && category !== 'all'
    ? getCategoryLabel(category)
    : 'All';

  const matchesCourse = useCallback((college, query) => {
    if (!query) return true;
    const lower = query.toLowerCase();
    return (college.coursesOffered || []).some(c => c.toLowerCase().includes(lower));
  }, []);

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
    result = result.filter(c => matchesCourse(c, courseQuery));

    if (selectedZone !== 'any') {
      result = result.filter(c => getZone(c.location) === selectedZone);
    }

    if (sortBy !== 'default') {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'fee-low': return (a.feeValue || 0) - (b.feeValue || 0);
          case 'fee-high': return (b.feeValue || 0) - (a.feeValue || 0);
          case 'pkg-high': return (b.avgPkgValue || 0) - (a.avgPkgValue || 0);
          case 'pkg-low': return (a.avgPkgValue || 0) - (b.avgPkgValue || 0);
          case 'nirf': return extractNirfNum(a.nirfRank) - extractNirfNum(b.nirfRank);
          case 'name': return a.name.localeCompare(b.name);
          default: return 0;
        }
      });
    }

    setFilteredColleges(result);
  }, [category, query, feeRange, admissionMode, courseQuery, selectedZone, sortBy, matchesCourse]);

  const clearFilters = useCallback(() => {
    setFeeRange('any');
    setAdmissionMode('any');
    setCourseQuery('');
    setSelectedZone('any');
    setSortBy('default');
  }, []);

  const hasActiveFilters = feeRange !== 'any' || admissionMode !== 'any' || courseQuery || selectedZone !== 'any';

  return (
    <div className="container section animate-fade-in course-listing-page">
      <div className="listing-header">
        <div>
          <h1 className="heading-2">Top {categoryLabel} Colleges in Bangalore</h1>
          <p className="body-text">Showing {filteredColleges.length} results</p>
        </div>
        <div className="listing-header-actions">
          <select className="filter-select sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="fee-low">Fee: Low to High</option>
            <option value="fee-high">Fee: High to Low</option>
            <option value="pkg-high">Package: High to Low</option>
            <option value="pkg-low">Package: Low to High</option>
            <option value="nirf">NIRF Rank</option>
            <option value="name">Name: A-Z</option>
          </select>
          <button
            className={`btn-secondary filter-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(s => !s)}
          >
            {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
            Filters
            {hasActiveFilters && <span className="filter-badge">{' '}&bull;{' '}</span>}
          </button>
        </div>
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
            <div className="filter-group">
              <label className="small-text font-semibold">Course</label>
              <div className="course-filter-wrap">
                <Search size={14} className="course-filter-icon" />
                <input
                  type="text"
                  className="filter-input course-filter-input"
                  placeholder="e.g. Data Science, CSE..."
                  value={courseQuery}
                  onChange={e => setCourseQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="filter-group">
              <label className="small-text font-semibold">Location Zone</label>
              <select
                className="filter-select"
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
              >
                <option value="any">Any</option>
                <option value="North">North Bangalore</option>
                <option value="South">South Bangalore</option>
                <option value="East">East Bangalore</option>
                <option value="West">West Bangalore</option>
                <option value="Central">Central Bangalore</option>
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