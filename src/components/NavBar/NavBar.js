import React from 'react'
import { NavLink, Link } from "react-router-dom";
import './Nav.css'

function NavBar() {
  return (
    <header>
      <article>
        <h1>
          <Link to="/">
            Youtube
          </Link>
        </h1>
      </article>
      <aside>
        <ul>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/About"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              About
            </NavLink>
          </li>
        </ul>
      </aside>
    </header>
  )
}

export default NavBar