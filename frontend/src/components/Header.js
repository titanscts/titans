/* eslint-disable eqeqeq */
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Fragment, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";
import classes from "./Header.module.css";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = authCtx.isLoggedIn;
  const isApplicant = authCtx.type == 0;
  const isAdmin = authCtx.type == 1;

  const logout = () => {
    authCtx.logout();
    navigate("/login");
  };
  const activeStyle = {
    fontWeigh: "bold",
    borderBottom: "2px solid #14A800",
    outline: "none",
    padding: "8px 0px",
    cursor: "pointer",
  };
  return (
    <nav className={`navbar navbar-expand-sm bg-white shadow ${classes.stick}`}>
      <div className="container">
        <Link className="navbar-brand text-green fw-bold" to="/">
          Titans
        </Link>
        <button
          className="navbar-toggler green shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynavbar"
        >
          <span className="navbar-toggler-icon green text-green pt-2">
            <MenuOutlined />
          </span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="mynavbar"
        >
          <ul className="navbar-nav">
            {(isApplicant || (!isApplicant && !isAdmin)) && (
              <Fragment>
                <li className="nav-item p-2">
                  <NavLink
                    to="home"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item p-2">
                  <NavLink
                    to="search"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    All Jobs
                  </NavLink>
                </li>
                {isLoggedIn && (
                  <Fragment>
                    <li className="nav-item p-2">
                      <NavLink
                        to="applications"
                        style={({ isActive }) =>
                          isActive ? activeStyle : undefined
                        }
                      >
                        Applications
                      </NavLink>
                    </li>
                    <li className="nav-item p-2">
                      <NavLink
                        to="profile"
                        style={({ isActive }) =>
                          isActive ? activeStyle : undefined
                        }
                      >
                        Profile
                      </NavLink>
                    </li>{" "}
                  </Fragment>
                )}
              </Fragment>
            )}
            {isAdmin && (
              <Fragment>
                <li className="nav-item p-2">
                  <NavLink
                    to="recruiter/dashboard"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item p-2">
                  <NavLink
                    to="recruiter/post-job"
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    Post job
                  </NavLink>
                </li>
              </Fragment>
            )}
            {!isLoggedIn && (
              <li className="nav-item p-2 text-green">
                <NavLink
                  to="login"
                  style={({ isActive }) => (isActive ? activeStyle : undefined)}
                >
                  Login
                </NavLink>
              </li>
            )}
            {isLoggedIn && (
              <li className="nav-item p-2 text-green">
                <span className="h7 d-none d-sm-block" onClick={logout}>
                  <LogoutOutlined />
                </span>
                <span className="py d-block d-sm-none" onClick={logout}>
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
