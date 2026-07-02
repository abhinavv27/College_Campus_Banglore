import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { colleges } from '../data/colleges';
import { MapPin, Globe, Award, IndianRupee, Briefcase, GraduationCap, Building } from 'lucide-react';
import './CollegeDetails.css';

const CollegeDetails = () => {
  const { id } = useParams();
  const { favorites, toggleFavorite, compareList, toggleCompare } = useContext(AppContext);
  const [college, setCollege] = useState(null);

  useEffect(() => {
    const found = colleges.find(c => c.id === id);
    setCollege(found);
  }, [id]);

  if (!college) {
    return <div className="container section"><h2>College not found.</h2></div>;
  }

  const isFav = favorites.includes(college.id);
  const isCompared = compareList.includes(college.id);

  return (
    <div className="animate-fade-in college-details-page">
      {/* Hero Banner */}
      <div className="details-hero">
        <img src={college.gallery[0]} alt={college.name} className="hero-bg" />
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-info">
            <h1 className="heading-1" style={{ color: '#fff', marginBottom: '1rem' }}>{college.name}</h1>
            <div className="hero-tags">
              <span className="badge">NAAC {college.naacGrade}</span>
              {college.nirfRank && <span className="badge">NIRF {college.nirfRank}</span>}
              <span className="badge">{college.category}</span>
            </div>
          </div>
          <div className="hero-actions">
            <button className={`btn-secondary ${isFav ? 'active-fav' : ''}`} onClick={() => toggleFavorite(college.id)}>
              {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button className={`btn-primary ${isCompared ? 'active-compare' : ''}`} onClick={() => toggleCompare(college.id)}>
              {isCompared ? 'Remove from Compare' : 'Compare'}
            </button>
          </div>
        </div>
      </div>

      <div className="container section details-layout">
        <main className="details-main">
          {/* Overview */}
          <section className="card details-section">
            <h2 className="heading-2 section-title">Overview</h2>
            <p className="body-text">{college.overview}</p>
            <div className="quick-stats">
              <div className="q-stat">
                <IndianRupee className="q-icon" size={20} />
                <div>
                  <span className="q-label">Total Fees</span>
                  <span className="q-value">{college.fees}</span>
                </div>
              </div>
              <div className="q-stat">
                <Award className="q-icon" size={20} />
                <div>
                  <span className="q-label">Highest Package</span>
                  <span className="q-value">{college.highestPackage}</span>
                </div>
              </div>
              <div className="q-stat">
                <Briefcase className="q-icon" size={20} />
                <div>
                  <span className="q-label">Avg Package</span>
                  <span className="q-value">{college.averagePackage}</span>
                </div>
              </div>
              <div className="q-stat">
                <GraduationCap className="q-icon" size={20} />
                <div>
                  <span className="q-label">Admission Mode</span>
                  <span className="q-value">{college.admissionMode}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="card details-section">
            <h2 className="heading-2 section-title">Courses Offered</h2>
            <div className="course-tags">
              {college.coursesOffered.map((course, idx) => (
                <span key={idx} className="badge course-badge">{course}</span>
              ))}
            </div>
            <div className="eligibility-box">
              <h4 className="heading-3">Eligibility</h4>
              <p className="body-text">{college.eligibility}</p>
            </div>
          </section>

          {/* Placements */}
          <section className="card details-section">
            <h2 className="heading-2 section-title">Placements & Recruiters</h2>
            <div className="placement-stats">
              <div className="p-stat-box">
                <span className="p-val">{college.placementPercentage}</span>
                <span className="p-lab">Placement Rate</span>
              </div>
              <div className="p-stat-box">
                <span className="p-val">{college.averagePackage}</span>
                <span className="p-lab">Average Salary</span>
              </div>
              <div className="p-stat-box">
                <span className="p-val">{college.highestPackage}</span>
                <span className="p-lab">Highest Salary</span>
              </div>
            </div>
            <h4 className="heading-3" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Top Recruiters</h4>
            <div className="recruiter-tags">
              {college.topRecruiters.map((recruiter, idx) => (
                <span key={idx} className="badge recruiter-badge">{recruiter}</span>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="card details-section">
            <h2 className="heading-2 section-title">Student Reviews</h2>
            <div className="reviews-list">
              {college.reviews.map((rev, idx) => (
                <div key={idx} className="review-item">
                  <div className="reviewer-info">
                    <span className="reviewer-name font-semibold">{rev.user}</span>
                    <span className="reviewer-rating">★ {rev.rating}/5</span>
                  </div>
                  <p className="body-text mt-2">{rev.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="details-sidebar">
          {/* Quick Info */}
          <div className="card side-card">
            <h3 className="heading-3 side-title">Campus & Facilities</h3>
            <ul className="facilities-list">
              {college.facilities.map((fac, idx) => (
                <li key={idx}>
                  <Building size={16} /> {fac}
                </li>
              ))}
            </ul>
            <div className="hostel-info mt-4">
              <strong>Hostel Fees:</strong> {college.hostelFees}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="card side-card">
            <h3 className="heading-3 side-title">Pros & Cons</h3>
            <div className="pros-cons">
              <div className="pros">
                <strong>Pros</strong>
                <ul>
                  {college.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
                </ul>
              </div>
              <div className="cons mt-4">
                <strong>Cons</strong>
                <ul>
                  {college.cons.map((con, idx) => <li key={idx}>{con}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <a href={college.website} target="_blank" rel="noopener noreferrer" className="btn-primary full-width mt-4" style={{ justifyContent: 'center' }}>
            <Globe size={18} /> Official Website
          </a>
        </aside>
      </div>
    </div>
  );
};

export default CollegeDetails;
