import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Heart, BarChart2, MapPin, Award, IndianRupee } from 'lucide-react';
import './CollegeCard.css';

const FALLBACK_IMG = '/images/colleges/placeholder.svg';

const CollegeCard = ({ college }) => {
  const { favorites, toggleFavorite, compareList, toggleCompare } = useContext(AppContext);
  
  const isFav = favorites.includes(college.id);
  const isCompared = compareList.includes(college.id);

  return (
    <div className="card college-card animate-fade-in">
      <div className="card-header">
        <div className="card-image-wrap">
          <img src={college.photo} alt={college.name} className="card-image" loading="lazy" onError={(e) => { e.target.src = FALLBACK_IMG }} />
          <div className="card-badges">
            {college.nirfRank && <span className="badge">NIRF {college.nirfRank}</span>}
            {college.naacGrade && <span className="badge">NAAC {college.naacGrade}</span>}
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="card-title-row">
          <Link to={`/college/${college.id}`}>
            <h3 className="heading-3 card-title">{college.shortName}</h3>
          </Link>
          <div className="card-actions">
            <button 
              className={`icon-btn small-btn ${isCompared ? 'active' : ''}`} 
              onClick={() => toggleCompare(college.id)}
              title="Compare"
            >
              <BarChart2 size={16} />
            </button>
            <button 
              className={`icon-btn small-btn ${isFav ? 'active-fav' : ''}`} 
              onClick={() => toggleFavorite(college.id)}
              title="Favorite"
            >
              <Heart size={16} fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        
        <p className="small-text text-muted truncate">{college.name}</p>
        
        <div className="card-stats">
          <div className="stat-item">
            <IndianRupee size={14} className="stat-icon" />
            <span>Fees: {college.fees}</span>
          </div>
          <div className="stat-item">
            <Award size={14} className="stat-icon" />
            <span>Avg Pkg: {college.averagePackage}</span>
          </div>
        </div>

        <div className="card-footer">
          <Link to={`/college/${college.id}`} className="btn-primary full-width">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
