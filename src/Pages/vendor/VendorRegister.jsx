import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorRegister.css';

const DEFAULT_ESTATES = ['Greenwood Estates', 'Kilimani Heights', 'South C Enclave'];
const ADD_NEW_VALUE = '__add_new__';

const VendorRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    estateCoverage: 'Greenwood Estates',
    capacityLiters: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Dynamic estate list ---
  const [estates, setEstates] = useState(DEFAULT_ESTATES);
  const [showAddEstate, setShowAddEstate] = useState(false);
  const [newEstateName, setNewEstateName] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEstateSelect = (e) => {
    const value = e.target.value;
    if (value === ADD_NEW_VALUE) {
      setShowAddEstate(true);
      return;
    }
    setFormData(prev => ({ ...prev, estateCoverage: value }));
  };

  const handleAddEstate = () => {
    const trimmed = newEstateName.trim();
    if (trimmed.length < 3) {
      alert('Please enter a valid estate name (at least 3 characters).');
      return;
    }
    if (estates.some(e => e.toLowerCase() === trimmed.toLowerCase())) {
      alert('That estate is already in the list.');
      return;
    }
    setEstates(prev => [...prev, trimmed]);
    setFormData(prev => ({ ...prev, estateCoverage: trimmed }));
    setNewEstateName('');
    setShowAddEstate(false);
  };

  // --- Validation ---
  // Kenyan phone: 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX / +2541XXXXXXXX (spaces allowed)
  const PHONE_REGEX = /^(?:\+254|0)[71]\d{8}$/;
  // Letters, spaces, apostrophes, hyphens only — no digits or symbols
  const NAME_REGEX = /^[A-Za-z][A-Za-z\s'\-]{1,59}$/;
  // Business name: letters/numbers/spaces/basic punctuation, not just repeated junk
  const BUSINESS_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s&.,'\-]{2,79}$/;

  const isGibberish = (value) => {
    // Flags strings like "asdasd", "aaaaaa", "1111" — same char/pair repeated across the whole string
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length < 3) return false;
    const uniqueChars = new Set(cleaned.toLowerCase()).size;
    return uniqueChars <= 2 && cleaned.length >= 4;
  };

  const validate = () => {
    const newErrors = {};
    const phoneNormalized = formData.phone.replace(/\s/g, '');

    if (!BUSINESS_NAME_REGEX.test(formData.businessName.trim()) || isGibberish(formData.businessName)) {
      newErrors.businessName = 'Enter a real business/station name (3-80 characters, letters & numbers only).';
    }

    if (!NAME_REGEX.test(formData.ownerName.trim()) || isGibberish(formData.ownerName)) {
      newErrors.ownerName = 'Enter a valid full name (letters only, no numbers or symbols).';
    }

    if (!PHONE_REGEX.test(phoneNormalized)) {
      newErrors.phone = 'Enter a valid Kenyan phone number, e.g. 0712345678 or +254712345678.';
    }

    const capacity = Number(formData.capacityLiters);
    if (
      formData.capacityLiters === '' ||
      Number.isNaN(capacity) ||
      !Number.isFinite(capacity) ||
      capacity <= 0 ||
      capacity > 1000000 ||
      !Number.isInteger(capacity)
    ) {
      newErrors.capacityLiters = 'Enter a realistic whole number of liters (1 - 1,000,000).';
    }

    if (!formData.estateCoverage || formData.estateCoverage.trim().length < 3) {
      newErrors.estateCoverage = 'Please select or add a valid estate.';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must accept the compliance terms to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Persist the vendor profile so the dashboard can read it.
    // In a real app this would come from your backend/auth session instead.
    localStorage.setItem('majiVendorProfile', JSON.stringify({
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      phone: formData.phone,
      estateCoverage: formData.estateCoverage,
      capacityLiters: formData.capacityLiters
    }));

    // Simulate backend onboarding process response
    setIsSubmitted(true);
  };

  const goToDashboard = () => {
    // Adjust this path to match your actual route for the vendor dashboard
    navigate('/vendor/dashboard');
  };

  if (isSubmitted) {
    return (
      <div className="vr-centered-container">
        <div className="vr-success-card">
          <div className="vr-success-emoji">🎉</div>
          <h2 className="vr-form-title vr-success-title">Application Received!</h2>
          <p className="vr-success-text">
            Thank you for registering <b>{formData.businessName}</b>. Our operational audit team will verify your setup parameters and text an activation token code to <b>{formData.phone}</b> within 24 hours.
          </p>
          <div className="vr-success-actions">
            <button
              onClick={() => setIsSubmitted(false)}
              className="vr-submit-btn vr-submit-btn--no-margin vr-submit-btn--gray"
            >
              Back to Form
            </button>
            <button onClick={goToDashboard} className="vr-submit-btn vr-submit-btn--no-margin">
              Go to Vendor Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vr-centered-container">
      <div className="vr-form-card">
        <header className="vr-form-header">
          <h1 className="vr-form-title">Join Maji Platform</h1>
          <p className="vr-form-subtitle">Register your clean water station to begin receiving estate orders</p>
          <button
            type="button"
            onClick={goToDashboard}
            className="vr-dashboard-link-btn"
          >
            Already registered? Go to your dashboard
          </button>
        </header>

        <form onSubmit={handleRegister} noValidate>
          <div className="vr-form-group">
            <label className="vr-label">Business Entity / Station Name *</label>
            <input
              type="text"
              name="businessName"
              placeholder="e.g., AquaPure Springs Hub"
              value={formData.businessName}
              onChange={handleChange}
              className="vr-input"
            />
            {errors.businessName && <p className="vr-error-text">{errors.businessName}</p>}
          </div>

          <div className="vr-form-group">
            <label className="vr-label">Contact Representative Full Name *</label>
            <input
              type="text"
              name="ownerName"
              placeholder="e.g., Sarah Ochieng"
              value={formData.ownerName}
              onChange={handleChange}
              className="vr-input"
            />
            {errors.ownerName && <p className="vr-error-text">{errors.ownerName}</p>}
          </div>

          <div className="vr-form-group">
            <label className="vr-label">M-Pesa Connected Phone Number *</label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g., 0712 345 678"
              value={formData.phone}
              onChange={handleChange}
              className="vr-input"
            />
            {errors.phone && <p className="vr-error-text">{errors.phone}</p>}
          </div>

          <div className="vr-form-grid">
            <div className="vr-form-group">
              <label className="vr-label">Primary Target Estate</label>
              {!showAddEstate ? (
                <select
                  name="estateCoverage"
                  value={formData.estateCoverage}
                  onChange={handleEstateSelect}
                  className="vr-select"
                >
                  {estates.map(estate => (
                    <option key={estate} value={estate}>{estate}</option>
                  ))}
                  <option value={ADD_NEW_VALUE}>➕ Add new estate...</option>
                </select>
              ) : (
                <div className="vr-estate-add-row">
                  <input
                    type="text"
                    autoFocus
                    placeholder="New estate name"
                    value={newEstateName}
                    onChange={(e) => setNewEstateName(e.target.value)}
                    className="vr-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddEstate}
                    className="vr-submit-btn vr-submit-btn--no-margin vr-submit-btn--inline"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddEstate(false); setNewEstateName(''); }}
                    className="vr-submit-btn vr-submit-btn--no-margin vr-submit-btn--inline vr-submit-btn--gray"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {errors.estateCoverage && <p className="vr-error-text">{errors.estateCoverage}</p>}
            </div>

            <div className="vr-form-group">
              <label className="vr-label">Daily Capacity (Liters) *</label>
              <input
                type="number"
                name="capacityLiters"
                placeholder="e.g., 2000"
                value={formData.capacityLiters}
                onChange={handleChange}
                className="vr-input"
              />
              {errors.capacityLiters && <p className="vr-error-text">{errors.capacityLiters}</p>}
            </div>
          </div>

          <div className="vr-form-group vr-terms-group">
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="vr-terms-checkbox"
            />
            <label htmlFor="agreedToTerms" className="vr-terms-label">
              I certify that our source water is fully treated, complies with health regulations, and agree to platform transaction policies.
            </label>
          </div>
          {errors.agreedToTerms && <p className="vr-error-text">{errors.agreedToTerms}</p>}

          <button
            type="submit"
            disabled={!formData.agreedToTerms}
            className={`vr-submit-btn ${formData.agreedToTerms ? '' : 'vr-submit-btn--disabled'}`}
          >
            Submit Station Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;