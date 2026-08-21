import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <FontAwesomeIcon icon={faDroplet} />
        MAJI
      </div>
      <h1>Customer Dashboard</h1>
      <div className="navbar-spacer"></div>
    </header>
  );
}

export default Navbar;