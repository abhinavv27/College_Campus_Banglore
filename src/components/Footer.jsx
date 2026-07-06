import React from 'react';
import { Compass } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="brand">
            <Compass className="brand-icon" size={24} />
            <span className="brand-text">College Compass</span>
          </div>
          <p className="body-text footer-desc">
            Your ultimate guide to finding the best colleges in Bangalore for B.Tech, MBA, BBA, and B.Com.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4 className="footer-heading">Courses</h4>
            <a href="/course/Engineering">B.Tech</a>
            <a href="/course/MBA">MBA</a>
            <a href="/course/BBA">BBA</a>
            <a href="/course/B.Com">B.Com</a>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="small-text">© {new Date().getFullYear()} College Compass. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
