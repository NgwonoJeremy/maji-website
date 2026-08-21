import deliveryman from "../assets/deliveryman.png";
import { Link } from "react-router-dom";
import "../Home.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';
function Home() {
  return (
    <>
      <header className="site-header">
          <div className="logo-text">
            Maji
            <FontAwesomeIcon icon={faDroplet} />
          </div>
        <nav className="nav">
          <a href="#who">Who Are We?</a>
          <a href="#what">How It Works</a>
          <Link to="/Roles" className="nav-cta">Get Started</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-img">
          <div className="hero-img-glow" />
          <img src={deliveryman} alt="Water delivery man" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Maji
          </h1>
            <p className="hero-title-accent">Water delivered when you need it</p>
          <p className="hero-sub">
            Running low on water? Order jerricans from verified vendors near you.
          </p>
          <div className="hero-actions">
            <Link to="/Roles">
              <button className="btn-primary">Get started</button>
            </Link>
          </div>
        </div>
      </section>

      <section id="who" className="section-who">
        <div className="section-inner">
          <h2 className="section-title">Who are we?</h2>
          <p className="section-body">
            Maji is a community-driven platform connecting residents with trusted local water vendors. Whether you need a single 20-litre jerrican or a bulk delivery for your home or business, we find verified vendors near you for quick, reliable service.
          </p>
        </div>
      </section>

      <section id="what" className="section-how">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-n">01</span>
            <h3>Place your order</h3>
            <p>Tell us how much water you need and where you are.</p>
          </div>
          <div className="step">
            <span className="step-n">02</span>
            <h3>We find a vendor</h3>
            <p>You're matched with the nearest verified seller automatically.</p>
          </div>
          <div className="step">
            <span className="step-n">03</span>
            <h3>Track the delivery</h3>
            <p>Follow your order in real time, right from the app.</p>
          </div>
          <div className="step">
            <span className="step-n">04</span>
            <h3>Receive and rate</h3>
            <p>Your feedback keeps the whole network honest and accountable.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="logo-drop">💧</span>
          <span className="logo-text">Maji</span>
          <p className="footer-tagline">Water delivered when you need it.</p>
        </div>
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>📞 +254 700 000 000</p>
          <p>✉️ info@maji.com</p>
        </div>
        <div className="footer-copy">
          <p>© 2026 Maji. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;
