import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { colleges } from '../data/colleges';
import { MapPin, Globe, Award, IndianRupee, Briefcase, GraduationCap, Building, Star, ChevronRight } from 'lucide-react';
import './CollegeDetails.css';

const FALLBACK_IMG = '/images/colleges/placeholder.svg';
const REVIEWS_KEY = 'college-reviews';

const loadReviews = (collegeId) => {
  try {
    const data = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
    return data[collegeId] || [];
  } catch { return []; }
};

const saveReview = (collegeId, review) => {
  try {
    const data = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
    data[collegeId] = [...(data[collegeId] || []), review];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(data));
  } catch {}
};

const STAR_KEY = 'college-star-ratings';

const loadAvgRating = (collegeId) => {
  try {
    const data = JSON.parse(localStorage.getItem(STAR_KEY) || '{}');
    return data[collegeId] || null;
  } catch { return null; }
};

const saveRating = (collegeId, rating) => {
  try {
    const data = JSON.parse(localStorage.getItem(STAR_KEY) || '{}');
    if (!data[collegeId]) data[collegeId] = [];
    data[collegeId].push(rating);
    localStorage.setItem(STAR_KEY, JSON.stringify(data));
  } catch {}
};

const getAvgFromStorage = (collegeId) => {
  try {
    const data = JSON.parse(localStorage.getItem(STAR_KEY) || '{}');
    const ratings = data[collegeId] || [];
    if (ratings.length === 0) return null;
    return { avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1), count: ratings.length };
  } catch { return null; }
};

const predictEligibility = (cutoffText, rank) => {
  if (!cutoffText || !rank) return null;
  const text = cutoffText.toLowerCase();
  const nums = text.match(/\d+/g)?.map(Number) || [];

  if (text.includes('pgcet')) {
    const ranges = [];
    for (let i = 0; i < nums.length; i += 2) {
      if (nums[i + 1]) ranges.push([Math.min(nums[i], nums[i + 1]), Math.max(nums[i], nums[i + 1])]);
    }
    if (ranges.length === 0 && nums.length > 0) ranges.push([0, nums[0]]);
    if (ranges.length > 0) {
      for (const [low, high] of ranges) {
        if (rank >= low && rank <= high) return 'Eligible';
      }
      if (rank < ranges[0][0]) return 'Likely Eligible';
      return 'Not Recommended';
    }
  }

  if (text.includes('percentile') || text.includes('%')) {
    const percentiles = nums.filter(n => n <= 100);
    if (percentiles.length > 0) {
      return rank <= Math.max(...percentiles) * 1000 ? 'Eligible' : 'Check College Website';
    }
  }

  if (text.includes('rank') && nums.length > 0) {
    return rank <= Math.max(...nums) ? 'Eligible' : 'Check College Website';
  }

  return 'Check College Website';
};

const CollegeDetails = () => {
  const { id } = useParams();
  const { favorites, toggleFavorite, compareList, toggleCompare } = useContext(AppContext);
  const [college, setCollege] = useState(null);
  const [localReviews, setLocalReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ user: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);
  const [avgRating, setAvgRating] = useState(null);
  const [rankInput, setRankInput] = useState('');
  const [rankResult, setRankResult] = useState(null);
  const [similarColleges, setSimilarColleges] = useState([]);

  useEffect(() => {
    const found = colleges.find(c => c.id === id);
    setCollege(found);
    if (found) {
      setLocalReviews(loadReviews(found.id));
      setAvgRating(getAvgFromStorage(found.id));
      setRankInput('');
      setRankResult(null);
      setSubmitted(false);

      const similar = colleges
        .filter(c => c.category === found.category && c.id !== found.id)
        .map(c => ({ ...c, diff: Math.abs((c.feeValue || 0) - (found.feeValue || 0)) }))
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 3);
      setSimilarColleges(similar);
    }
  }, [id]);

  const handleReviewSubmit = useCallback((e) => {
    e.preventDefault();
    if (!reviewForm.user.trim() || !reviewForm.comment.trim()) return;
    const review = { ...reviewForm, date: new Date().toISOString() };
    saveReview(college.id, review);
    saveRating(college.id, reviewForm.rating);
    setLocalReviews(prev => [...prev, review]);
    setAvgRating(getAvgFromStorage(college.id));
    setReviewForm({ user: '', rating: 5, comment: '' });
    setSubmitted(true);
  }, [reviewForm, college]);

  const handlePredict = useCallback(() => {
    const rank = parseInt(rankInput, 10);
    if (isNaN(rank) || rank < 1) return;
    setRankResult(predictEligibility(college.cutoffDetailed, rank));
  }, [rankInput, college]);

  if (!college) {
    return <div className="container section"><h2>College not found.</h2></div>;
  }

  const isFav = favorites.includes(college.id);
  const isCompared = compareList.includes(college.id);

  const courses = college.coursesOffered || [];
  const recruiters = college.topRecruiters || [];
  const reviews = college.reviews || [];
  const allReviews = [...reviews, ...localReviews];
  const facilities = college.facilities || [];
  const prosList = college.pros || [];
  const consList = college.cons || [];

  return (
    <div className="animate-fade-in college-details-page">
      {/* Hero Banner */}
      <div className="details-hero">
        <img src={college.photo} alt={college.name} className="hero-bg" onError={(e) => { e.target.src = FALLBACK_IMG }} />
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-info">
            <h1 className="heading-1" style={{ color: '#fff', marginBottom: '1rem' }}>{college.name}</h1>
            <div className="hero-tags">
              {college.naacGrade && <span className="badge">NAAC {college.naacGrade}</span>}
              {college.nirfRank && <span className="badge">NIRF {college.nirfRank}</span>}
              <span className="badge">{college.category}</span>
            </div>
            {avgRating && (
              <div className="hero-rating">
                <span className="star-rating-display">{'★'.repeat(Math.round(Number(avgRating.avg)))}</span>
                <span className="rating-text">{avgRating.avg} ({avgRating.count} ratings)</span>
              </div>
            )}
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
            <p className="body-text">{college.overview || 'Information is being updated for this college.'}</p>
            <div className="quick-stats">
              <div className="q-stat">
                <IndianRupee className="q-icon" size={20} />
                <div>
                  <span className="q-label">Total Fees</span>
                  <span className="q-value">{college.fees || '—'}</span>
                </div>
              </div>
              <div className="q-stat">
                <Award className="q-icon" size={20} />
                <div>
                  <span className="q-label">Highest Package</span>
                  <span className="q-value">{college.highestPackage || '—'}</span>
                </div>
              </div>
              <div className="q-stat">
                <Briefcase className="q-icon" size={20} />
                <div>
                  <span className="q-label">Avg Package</span>
                  <span className="q-value">{college.averagePackage || '—'}</span>
                </div>
              </div>
              <div className="q-stat">
                <GraduationCap className="q-icon" size={20} />
                <div>
                  <span className="q-label">Admission Mode</span>
                  <span className="q-value">{college.admissionMode || '—'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Courses */}
          <section className="card details-section">
            <h2 className="heading-2 section-title">Courses Offered</h2>
            {courses.length > 0 ? (
              <div className="course-tags">
                {courses.map((course, idx) => (
                  <span key={idx} className="badge course-badge">{course}</span>
                ))}
              </div>
            ) : (
              <p className="body-text text-muted">Course details coming soon.</p>
            )}
            <div className="eligibility-box">
              <h4 className="heading-3">Eligibility</h4>
              <p className="body-text">{college.eligibility || 'Information coming soon.'}</p>
            </div>
          </section>

          {/* Placements */}
          <section className="card details-section">
            <h2 className="heading-2 section-title">Placements & Recruiters</h2>
            <div className="placement-stats">
              <div className="p-stat-box">
                <span className="p-val">{college.placementPercentage || '—'}</span>
                <span className="p-lab">Placement Rate</span>
              </div>
              <div className="p-stat-box">
                <span className="p-val">{college.averagePackage || '—'}</span>
                <span className="p-lab">Average Salary</span>
              </div>
              <div className="p-stat-box">
                <span className="p-val">{college.highestPackage || '—'}</span>
                <span className="p-lab">Highest Salary</span>
              </div>
            </div>
            {recruiters.length > 0 && (
              <>
                <h4 className="heading-3" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Top Recruiters</h4>
                <div className="recruiter-tags">
                  {recruiters.map((recruiter, idx) => (
                    <span key={idx} className="badge recruiter-badge">{recruiter}</span>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Cutoff / Rank Predictor */}
          {college.cutoffDetailed && (
            <section className="card details-section">
              <h2 className="heading-2 section-title">Cut-off & Rank Predictor</h2>
              <p className="body-text small-text" style={{ marginBottom: '1rem' }}>
                {college.cutoffDetailed}
              </p>
              <div className="rank-predictor-box">
                <label className="small-text font-semibold" htmlFor="rank-input">
                  Enter your KCET / COMEDK / PGCET rank to check eligibility:
                </label>
                <div className="rank-input-row">
                  <input
                    id="rank-input"
                    type="number"
                    className="rank-input"
                    placeholder="e.g. 5000"
                    value={rankInput}
                    onChange={e => setRankInput(e.target.value)}
                    min="1"
                  />
                  <button className="btn-primary" onClick={handlePredict} disabled={!rankInput}>Check</button>
                </div>
                {rankResult && (
                  <div className={`rank-result rank-${rankResult.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="rank-result-text">{rankResult}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="card details-section">
            <h2 className="heading-2 section-title">Student Reviews</h2>
            {allReviews.length > 0 && (
              <div className="reviews-list">
                {allReviews.map((rev, idx) => (
                  <div key={idx} className="review-item">
                    <div className="reviewer-info">
                      <span className="reviewer-name font-semibold">{rev.user}</span>
                      <span className="reviewer-rating">★ {rev.rating}/5</span>
                    </div>
                    <p className="body-text mt-2">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
            {allReviews.length === 0 && (
              <p className="body-text text-muted">No reviews yet. Be the first to review!</p>
            )}

            {/* Review Form */}
            <div className="review-form-box">
              <h4 className="heading-3" style={{ marginBottom: '1rem' }}>Write a Review</h4>
              {submitted ? (
                <p className="body-text" style={{ color: 'var(--accent-blue)' }}>Thank you for your review!</p>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  <div className="review-form-row">
                    <input
                      type="text"
                      className="review-input"
                      placeholder="Your name"
                      value={reviewForm.user}
                      onChange={e => setReviewForm(f => ({ ...f, user: e.target.value }))}
                      required
                    />
                    <div className="star-selector">
                      {[5, 4, 3, 2, 1].map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`star-btn ${s <= reviewForm.rating ? 'active' : ''}`}
                          onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="review-textarea"
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    rows={3}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ marginTop: '0.75rem' }}>
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Similar Colleges */}
          {similarColleges.length > 0 && (
            <section className="card details-section">
              <h2 className="heading-2 section-title">Similar Colleges</h2>
              <div className="similar-grid">
                {similarColleges.map(sc => (
                  <Link to={`/college/${sc.id}`} key={sc.id} className="similar-card">
                    <img src={sc.photo} alt={sc.name} className="similar-img" onError={(e) => { e.target.src = FALLBACK_IMG }} />
                    <div className="similar-info">
                      <strong>{sc.shortName}</strong>
                      <span className="small-text">{sc.fees}</span>
                    </div>
                    <ChevronRight size={16} className="similar-arrow" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="details-sidebar">
          {/* Quick Info */}
          <div className="card side-card">
            <h3 className="heading-3 side-title">Campus & Facilities</h3>
            {facilities.length > 0 ? (
              <ul className="facilities-list">
                {facilities.map((fac, idx) => (
                  <li key={idx}>
                    <Building size={16} /> {fac}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="body-text text-muted">Facility details coming soon.</p>
            )}
            <div className="hostel-info mt-4">
              <strong>Hostel Fees:</strong> {college.hostelFees || '—'}
            </div>
          </div>

          {/* Pros & Cons */}
          {(prosList.length > 0 || consList.length > 0) && (
            <div className="card side-card">
              <h3 className="heading-3 side-title">Pros & Cons</h3>
              <div className="pros-cons">
                {prosList.length > 0 && (
                  <div className="pros">
                    <strong>Pros</strong>
                    <ul>
                      {prosList.map((pro, idx) => <li key={idx}>{pro}</li>)}
                    </ul>
                  </div>
                )}
                {consList.length > 0 && (
                  <div className="cons mt-4">
                    <strong>Cons</strong>
                    <ul>
                      {consList.map((con, idx) => <li key={idx}>{con}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {college.website && (
            <a href={college.website} target="_blank" rel="noopener noreferrer" className="btn-primary full-width mt-4" style={{ justifyContent: 'center' }}>
              <Globe size={18} /> {college.website.includes('pagalguy') ? 'View on PaGaLGuY' : 'Official Website'}
            </a>
          )}
        </aside>
      </div>
    </div>
  );
};

export default CollegeDetails;