import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Auth.css";

const validate = (fields) => {
  const errors = {};
  if (!fields.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!fields.password) {
    errors.password = "Password is required";
  } else if (fields.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [authError, setAuthError]       = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError("");
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setAuthError("");

    const fieldErrors = validate(formData);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const response= await fetch ("http://localhost:3001/api/auth/login",{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if(!response.ok) {
        setAuthError (data.message || "Login Failed");
        return;
      }

      localStorage.setItem("maji_token",data.token);
      localStorage.setItem("maji_user",JSON.stringify(data.user));

      if (data.user.role === "admin")    navigate("/admin");
      if (data.user.role === "vendor")   navigate("/vendor/dashboard");
      if (data.user.role === "customer") navigate("/customer");
    }catch (err) {
      setAuthError("Cannot connect to server.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-section">
        <div className="auth-card">
          <Link to="/" className="auth-back">← Back</Link>

          <h1>Welcome back</h1>
          <p className="auth-sub">Don't have an account? <Link to="/register">Register here</Link></p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {authError && <span className="error-message">{authError}</span>}

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
              <label htmlFor="password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
