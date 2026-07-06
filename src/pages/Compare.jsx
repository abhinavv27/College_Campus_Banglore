import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { colleges } from '../data/colleges';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import './Compare.css';

const FALLBACK_IMG = '/images/colleges/placeholder.svg';

const formatLakh = (val) => {
  if (!val) return '—';
  return `₹${(val / 100000).toFixed(1)} L`;
};

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

  const maxFee = Math.max(...selectedColleges.map(c => c.feeValue || 0), 1);
  const maxPkg = Math.max(...selectedColleges.map(c => c.avgPkgValue || 0), 1);

  return (
    <div className="container section animate-fade-in">
      <h1 className="heading-2 mb-4">Compare Colleges</h1>

      {/* Chart Row */}
      <div className="compare-charts">
        <div className="chart-section">
          <h3 className="heading-3" style={{ marginBottom: '1rem' }}>Fee vs Package Comparison</h3>
          <div className="chart-grid">
            {selectedColleges.map(c => {
              const feePct = Math.min(((c.feeValue || 0) / maxFee) * 100, 100);
              const pkgPct = Math.min(((c.avgPkgValue || 0) / maxPkg) * 100, 100);
              return (
                <div key={c.id} className="chart-col">
                  <div className="chart-labels">
                    <span className="chart-label">{c.shortName}</span>
                    <span className="chart-value">{formatLakh(c.feeValue)}</span>
                  </div>
                  <div className="chart-bar-group">
                    <div className="chart-bar-track">
                      <div className="chart-bar fee-bar" style={{ width: `${feePct}%` }}></div>
                    </div>
                    <span className="chart-bar-label">Fee</span>
                  </div>
                  <div className="chart-bar-group">
                    <div className="chart-bar-track">
                      <div className="chart-bar pkg-bar" style={{ width: `${pkgPct}%` }}></div>
                    </div>
                    <span className="chart-bar-label">Avg Package</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
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
                    <img src={c.photo} alt={c.name} className="compare-img" onError={(e) => { e.target.src = FALLBACK_IMG }} />
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