import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

// destruction by pulling out
export const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          <i className="fas fa-users"></i>{' '}
          <span className="hide-sm">Developers</span>
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user-cog"></i>{' '}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to="/posts">
          <i className="fas fa-pen" /> <span className="hide-sm">Posts</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          <i className="fas fa-users"></i>{' '}
          <span className="hide-sm">Developers</span>
        </Link>
      </li>
      <li>
        <Link to="/register">
          <i className="fas fa-user-alt"></i>{' '}
          <span className="hide-sm">Register</span>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <i className="fas fa-sign-in-alt"></i>{' '}
          <span className="hide-sm">Login</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fab fa-staylinked"></i>
          <span> LinkDevs</span>
        </Link>
      </h1>
      {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
    </nav>
  );
};

Navbar.prototype = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.authReducer
});

export default connect(mapStateToProps, { logout })(Navbar);
