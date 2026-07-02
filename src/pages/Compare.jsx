import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { colleges } from '../data/colleges';
import { Link } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import './Compare.css';

const FALLBACK_IMG = '/images/colleges/placeholder.svg';

const Compare = () => {
  const { compareList, toggleCompare } = useContext(AppContext);
  
  const selectedColleges = colleges.filter(c => compareList.includes(c.id));

  if (selectedColleges.length === 0) {
    return (
      <div className="container section animate-fade-in text-center" style={{ padding: '6rem 0' }}>
        <h2 className="heading-2">Compare Colleges</h2>
        <p className="body-text" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          You haven't selected any colleges to compare.
        </p>
        <Link to="/" className="btn-primary">Browse Colleges</Link>
      </div>
    );
  }

  return (
    <div className="container section animate-fade-in">
      <h1 className="heading-2 mb-4">Compare Colleges</h1>
      
      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="feature-col">Features</th>
              {selectedColleges.map(c => (
                <th key={c.id} className="college-col">
                  <div className="compare-header">
                    <button className="remove-btn" onClick={() => toggleCompare(c.id)} title="Remove">
                      <X size={16} />
                    </button>
                    <img src={c.gallery[0]} alt={c.name} className="compare-img" onError={(e) => { e.target.src = FALLBACK_IMG }} />
                    <Link to={`/college/${c.id}`}><h3 className="heading-3 mt-2">{c.shortName}</h3></Link>
                    <p className="small-text">{c.category}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="feature-name">Total Fees</td>
              {selectedColleges.map(c => <td key={c.id}>{c.fees}</td>)}
            </tr>
            <tr>
              <td className="feature-name">Average Package</td>
              {selectedColleges.map(c => <td key={c.id}>{c.averagePackage}</td>)}
            </tr>
            <tr>
              <td className="feature-name">Highest Package</td>
              {selectedColleges.map(c => <td key={c.id}>{c.highestPackage}</td>)}
            </tr>
            <tr>
              <td className="feature-name">Admission Mode</td>
              {selectedColleges.map(c => <td key={c.id}>{c.admissionMode}</td>)}
            </tr>
            <tr>
              <td className="feature-name">Placement Rate</td>
              {selectedColleges.map(c => <td key={c.id}>{c.placementPercentage}</td>)}
            </tr>
            <tr>
              <td className="feature-name">NIRF Rank</td>
              {selectedColleges.map(c => <td key={c.id}>{c.nirfRank || 'N/A'}</td>)}
            </tr>
            <tr>
              <td className="feature-name">NAAC Grade</td>
              {selectedColleges.map(c => <td key={c.id}>{c.naacGrade || 'N/A'}</td>)}
            </tr>
            <tr>
              <td className="feature-name">Hostel Fees</td>
              {selectedColleges.map(c => <td key={c.id}>{c.hostelFees || 'N/A'}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
