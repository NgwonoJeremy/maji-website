import { NavLink } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';

function Navbar({ title = "Customer Dashboard" }) {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="logo">
          <FontAwesomeIcon icon={faDroplet} />
          MAJI
        </div>
        <nav className="navbar-links">
          <NavLink to="/customer" end>Dashboard</NavLink>
          <NavLink to="/customer/health">Health Journal</NavLink>
        </nav>
      </div>
      <h1>{title}</h1>
      <div className="navbar-spacer"></div>
    </header>
  );
}

export default Navbar;
