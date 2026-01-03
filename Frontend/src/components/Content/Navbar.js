import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AppNavbar({ color }) {

  return (
    <>
      <nav
        className="navbar"
      >
        <Link
          className="logo"
          style={{ textDecoration: "none", color: color ? "#296b2a" : "" }}
        >
          DayFlow
        </Link>
      </nav>
    </>
  );
}

export default AppNavbar;
