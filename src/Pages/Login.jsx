// import { Link,useNavigate} from "react-router-dom";
// import {useState} from "react";
// import "../Auth.css";

// const validate = (fields) => {
//   const errors = {};

//   if (!fields.email.trim()) {
//     errors.email = "Email is required";
//   } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
//     errors.email = "Enter a valid email address";
//   }

//   if (!fields.password) {
//     errors.password = "Password is required";
//   } else if (fields.password.length < 6) {
//     errors.password = "Password must be at least 6 characters";
//   }

//   return errors;
// };



// function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData]       = useState({ email: "", password: "" });
//   const [errors, setErrors]           = useState({});
//   const [authError, setAuthError]     = useState("");
//   const [loading, setLoading]         = useState(false);
//   const [showPassword, setShowPassword] = useState(false);


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };


//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const fieldErrors = validate(formData);

//     if (Object.keys(fieldErrors).length > 0) {
//       setErrors(fieldErrors);
//       return;
//     }

//     const users = JSON.parse(localStorage.getItem("maji_users") || "[]");

//     const match = users.find(
//       u => u.email === formData.email && u.password === formData.password
//     );

//     if (!match) {
//       setAuthError("Invalid email or password");
//       return;
//     }

//     localStorage.setItem("maji_user", JSON.stringify(match));

//     if (match.role === "admin")    navigate("/admin");
//     if (match.role === "vendor")   navigate("/vendor/dashboard");
//     if (match.role === "customer") navigate("/customer");
//   };
//   return (
//     <div className="auth-page">
//       <section className="auth-section">
//         <div className="auth-card">
//           <Link to="/" className="auth-back">← Back</Link>

//           <h1>Welcome back</h1>
//           <p className="auth-sub">Don't have an account? <Link to="/register">Register here</Link></p>

//           <form className="auth-form" onsubmit={handleSubmit}>
//             <div className="input-group">
//               <label htmlFor="email">Email</label>
//               <input id="email" type="email" placeholder="you@example.com" value={formData} onChange={handleChange}/>
//               {errors.email && <span className="error-message">{errors.email}</span>}
//             </div>

//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input id="password" type="password" placeholder="Your password" />
//             </div>

//            <Link to="/dashboard">
//                 <button type="button" className="btn-primary btn-full">
//                     Sign in
//                       </button>
//             </Link>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Login;
