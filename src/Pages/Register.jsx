import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Auth.css";

// TODO: replace with a real fetch to your `estates` table (id, name)
const ESTATES = [
  { id: 1, name: "Greenwood Estates" },
  { id: 2, name: "Riverside Gardens" },
  { id: 3, name: "Sunset Ridge" },
  { id: 4, name: "Palm Grove" },
];

const validate = (role, fields) => {
  const errors = {};

  if (!fields.fullName.trim()) {
    errors.fullName = role === "vendor" ? "Owner name is required" : "Full name is required";
  }

  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!fields.phone.trim()) {
    errors.phone = "Phone is required";
  }

  if (!fields.password) {
    errors.password = "Password is required";
  } else if (fields.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (role === "vendor") {
    if (!fields.businessName.trim()) {
      errors.businessName = "Business/station name is required";
    }
    if (!fields.dailyCapacity || Number(fields.dailyCapacity) <= 0) {
      errors.dailyCapacity = "Enter a valid daily capacity";
    }
    if (fields.targetEstates.length === 0) {
      errors.targetEstates = "Select at least one estate";
    }
  }

  return errors;
};

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer"); // "customer" | "vendor"
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    dailyCapacity: "",
    targetEstates: [],
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const isVendor = role === "vendor";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleEstate = (estateId) => {
    setFormData((f) => {
      const has = f.targetEstates.includes(estateId);
      return {
        ...f,
        targetEstates: has
          ? f.targetEstates.filter((id) => id !== estateId)
          : [...f.targetEstates, estateId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    const fieldErrors = validate(role, formData);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    // "JSON file" stand-in for the real users table until the API is wired up
    const storageKey = "maji_users";
    const users = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const emailTaken = users.some((u) => u.email === formData.email);
    if (emailTaken) {
      setAuthError("An account with this email already exists");
      return;
    }

    const newUser =
      role === "customer"
        ? {
            id: Date.now(),
            role,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password, // placeholder only — real API hashes this server-side
          }
        : {
            id: Date.now(),
            role,
            owner_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            business_name: formData.businessName,
            capacity_liters: Number(formData.dailyCapacity),
            estate_ids: formData.targetEstates,
            verification_status: "pending",
          };

    localStorage.setItem(storageKey, JSON.stringify([...users, newUser]));
    localStorage.setItem("maji_user", JSON.stringify(newUser));

    if (role === "vendor") navigate("/vendor/dashboard");
    if (role === "customer") navigate("/customer");
  };

  return (
    <div className="auth-page">
      <section className="auth-section">
        <div className="auth-card">
          <Link to="/" className="auth-back">← Back</Link>

          <h1>Create an account</h1>
          <p className="auth-sub">Already have one? <Link to="/login">Sign in</Link></p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="role-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                />
                <span className="role-label">I need water</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={role === "vendor"}
                  onChange={() => setRole("vendor")}
                />
                <span className="role-label">I'm a vendor</span>
              </label>
            </div>

            {authError && <span className="error-message">{authError}</span>}

            <div className="input-group">
              <label htmlFor="fullName">{isVendor ? "Contact / owner name" : "Full name"}</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Wanjiku"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="0712 345 678"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
              {isVendor && !errors.phone && (
                <span className="field-hint">Used for M-Pesa payouts.</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {isVendor && (
              <div className="business-section">
                <div className="section-divider">
                  <span>Business information</span>
                </div>

                <div className="input-group">
                  <label htmlFor="businessName">Business / Station name</label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="e.g., AquaPure Springs Hub"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                  {errors.businessName && <span className="error-message">{errors.businessName}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="dailyCapacity">Daily capacity (Liters)</label>
                  <input
                    id="dailyCapacity"
                    name="dailyCapacity"
                    type="number"
                    placeholder="2000"
                    value={formData.dailyCapacity}
                    onChange={handleChange}
                  />
                  {errors.dailyCapacity && <span className="error-message">{errors.dailyCapacity}</span>}
                </div>

                <div className="input-group">
                  <label>Estates you'll serve</label>
                  <div className="estate-checklist">
                    {ESTATES.map((estate) => (
                      <label key={estate.id} className="estate-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.targetEstates.includes(estate.id)}
                          onChange={() => toggleEstate(estate.id)}
                        />
                        <span>{estate.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.targetEstates && <span className="error-message">{errors.targetEstates}</span>}
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary btn-full">Create account</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;
