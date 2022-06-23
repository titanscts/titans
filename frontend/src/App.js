/* eslint-disable eqeqeq */
import { Fragment, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ConfigProvider } from "antd";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Dashboard from "./pages/Applicant/Dashboard";
import Filter from "./pages/Applicant/Filter";
import Home from "./pages/Applicant/Home/Home";
import JobDetails from "./pages/Applicant/JobDetails";
import Register from "./pages/Applicant/Register/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import AdminJobDetails from "./pages/Recruiter/JobDetails";
import PostJobWrapper from "./pages/Recruiter/PostJob/PostJobWrapper";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import ApplicantProfile from "./pages/Recruiter/ApplicantProfile";
import AdminRegisterWrapper from "./pages/Recruiter/Register/AdminRegisterWrapper";
import AuthContext from "./store/auth-context";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  // eslint-disable-next-line eqeqeq
  const isAdmin = authCtx.type == 1;
  const isUser = authCtx.type == 0;

  ConfigProvider.config({
    theme: {
      primaryColor: "#14A800",
    },
  });

  return (
    <Fragment>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password">
          <Route path=":token" element={<ResetPassword />} />
        </Route>

        {/* Applicant routes */}

        <Route path="register" element={<Register />} />
        {isLoggedIn && isUser && (
          <Fragment>
            <Route path="profile" element={<Dashboard />} />
            <Route path="applications" element={<Dashboard />} />
          </Fragment>
        )}
        <Route path="home" element={<Home />} />
        <Route path="search" element={<Filter />} />
        <Route path="job-details">
          <Route path=":jobId" element={<JobDetails />} />
        </Route>

        {/* End applicant routes */}

        {/* Recruiter routes */}

        <Route path="recruiter/register" element={<AdminRegisterWrapper />} />

        {isLoggedIn ? (
          isAdmin && (
            <Route path="recruiter/">
              <Route path="post-job" element={<PostJobWrapper />} />
              <Route path="edit-job">
                <Route path=":jobId" element={<PostJobWrapper />} />
              </Route>
              <Route path="job-details">
                <Route path=":jobId" element={<AdminJobDetails />} />
              </Route>
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="applicant-profile">
                <Route path=":applicantId" element={<ApplicantProfile />} />
              </Route>
            </Route>
          )
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
        {/* Recruiter routes */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Fragment>
  );
}

export default App;
