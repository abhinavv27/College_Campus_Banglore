import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { colleges } from '../data/colleges';
import CollegeCard from '../components/CollegeCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useContext(AppContext);
  
  const favoriteColleges = colleges.filter(c => favorites.includes(c.id));

  return (
    <div className="container section animate-fade-in" style={{ paddingTop: '3rem' }}>
      <h1 className="heading-2" style={{ marginBottom: '2rem' }}>Your Favorites</h1>
      
      {favoriteColleges.length === 0 ? (
        <div className="text-center" style={{ padding: '4rem 0', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
          <p className="body-text" style={{ marginBottom: '1.5rem' }}>You haven't added any colleges to your favorites yet.</p>
          <Link to="/" className="btn-primary">Browse Colleges</Link>
        </div>
      ) : (
        <div className="college-grid">
          {favoriteColleges.map(college => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
