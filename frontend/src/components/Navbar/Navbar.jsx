import "./navbar.css";
import { Link } from "react-router-dom";
import React from "react";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navContainer">
        <div className="navItem">
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <span className="logo">Tweets</span>
          </Link>
        </div>
        <div className="navItem">
          <Link to="/users" style={{ color: "white", textDecoration: "none" }}>
            <span className="logo">Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
