import React from 'react'
import { NavLink, Link } from "react-router-dom";
import './Nav.css'

function NavBar() {
  return (
    <div id='headernav' className="container">
      <header>
        <div className="row">
          <div className="col">
            <h1>
              <Link to="/" className='text-decoration-none'>
                Youtube
              </Link>
            </h1>
          </div>
        </div>
      </header>
      <div className="row">
        <div className="col d-flex justify-content-between custom-bg">
          <div>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>

          </div>

          <div>
            <NavLink
              to="/About"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              About
            </NavLink>


          </div>

        </div>
      </div>
    </div>
  )
}

export default NavBar