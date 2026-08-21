import { Link } from "react-router-dom";
import "../Roles.css";

function Roles() {
  return (
    <section className="section-roles">
      <h2>Who are you?</h2>
      <p className="roles-subtitle">
        Pick your role to get started.
      </p>

      <div className="roles">

        <div className="role">
          <span className="role-1">01</span>
          <h3>Customer</h3>
          <p>I need water.</p>

          <Link to="/customer">
            <button className="role-btn">Continue as Customer</button>
          </Link>
        </div>

        <div className="role">
          <span className="role-1">02</span>
          <h3>Vendor</h3>
          <p>I sell and deliver water.</p>

          <Link to="/vendor/register">
            <button className="role-btn">Continue as Vendor</button>
          </Link>
        </div>

        <div className="role">
          <span className="role-1">03</span>
          <h3>Admin</h3>
          <p>I manage the platform.</p>

          <Link to="/admin">
            <button className="role-btn">Continue as Admin</button>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Roles;