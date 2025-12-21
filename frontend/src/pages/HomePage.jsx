/**
 * Home Page
 * Landing page with links to login/register
 */
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/home.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Smart Health Synchronizer</h1>
        <p className="hero-subtitle">
          Connect with healthcare professionals and manage your health records seamlessly
        </p>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/profile" className="btn-primary-large">
              Go to Profile
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary-large">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary-large">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🩺</div>
            <h3>Find Doctors</h3>
            <p>Search and connect with verified healthcare professionals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Book Appointments</h3>
            <p>Schedule appointments online with your preferred doctors</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Medical Records</h3>
            <p>Keep track of your health history and prescriptions</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Digital Prescriptions</h3>
            <p>Access and manage your prescriptions digitally</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📰</div>
            <h3>Health Blog</h3>
            <p>Read articles and stay updated on health topics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Reviews & Ratings</h3>
            <p>Read reviews and rate your doctor visits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
