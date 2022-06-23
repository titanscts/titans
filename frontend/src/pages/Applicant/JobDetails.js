import {
  BookFilled,
  BookOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Card, Spin, Tooltip } from "antd";
import Moment from "moment";
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./JobDetails.module.css";

const JobDetails = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const navigate = useNavigate();

  const params = useParams();
  const jobId = params.jobId;

  useEffect(() => {
    getJobDetails();
    if (isLoggedIn) {
      isJobSavedAndApplied();
    }
  }, []);

  const getJobDetails = async () => {
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/recruiter/getJobById/${jobId}`, {
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${authCtx.token}`,
        // },
      })
    ).json();
    if (res.status) {
      setJobDetails(res.data);
      setIsLoading(false);
    }
  };

  const isJobSavedAndApplied = async () => {
    const res = await (
      await fetch(
        `${process.env.REACT_APP_HOST}/applicant/isJobSavedAndApplied/${jobId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      )
    ).json();
    if (res.status) {
      setIsApplied(res.data.isApplied);
      setIsSaved(res.data.isSaved);
    }
  };

  const applyForJob = async () => {
    const res = await (
      await fetch(
        `${process.env.REACT_APP_HOST}/applicant/changeApplyJob/${jobId}/${!isApplied}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      )
    ).json();
    console.log(res);
    if (res.status) {
      setIsApplied(!isApplied);
    }
  };

  const changeSaveJob = async () => {
    const res = await (
      await fetch(
        `${process.env.REACT_APP_HOST}/applicant/changeSaveJob/${jobId}/${!isSaved}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      )
    ).json();
    console.log(res);
    if (res.status) {
      setIsSaved(!isSaved);
    }
  };

  const redirectToLogin = () => {
    navigate("login");
  };

  return (
    <div className="container mt-4">
      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <Fragment>
          <Card bodyStyle={{ padding: "16px" }}>
            <h3 className="text-dark">
              Job Details
              {isLoggedIn && (
                <span className="float-end mx-4 pt-1" onClick={changeSaveJob}>
                  <Tooltip
                    placement="bottom"
                    title={isSaved ? "Unsave Job" : "Save Job"}
                    role="button"
                  >
                    {!isSaved ? <BookOutlined /> : <BookFilled />}
                  </Tooltip>
                </span>
              )}
            </h3>
            <hr style={{ height: "2px", color: "black" }}></hr>

            <div className="row">
              <div className="col-12">
                <h5 className="text-dark text-justify">
                  {jobDetails.jobTitle}
                </h5>
              </div>
              <div className="col-12 col-sm-6 fs-17 mt-1 text-secondary">
                <div className="mb-2">
                  <ShoppingOutlined /> {jobDetails.experience.$numberDecimal}{" "}
                  Years (min)
                </div>
                <div className="mb-2">
                  <WalletOutlined /> &#8377;
                  {`${jobDetails.minSalary}-${jobDetails.maxSalary} LPA`}
                </div>
                <div>
                  <EnvironmentOutlined /> {jobDetails.location.join(", ")}
                </div>
                <br />
              </div>
              <div className="col-12 col-sm-6 fs-17 position-relative">
                <div>
                  {isLoggedIn ? (
                    <Button
                      type="primary"
                      size="large"
                      className="position-absolute bottom-0 end-0 translate-middle"
                      onClick={applyForJob}
                    >
                      {isApplied ? "Withdraw" : "Apply"}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      className="position-absolute bottom-0 end-0 translate-middle"
                      onClick={redirectToLogin}
                    >
                      Login to Apply
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <hr style={{ height: "1px", color: "black", margin: "0" }}></hr>

            <div className="mt-2 fs-16">
              Posted on:{" "}
              <span className="fw-bold">
                {Moment(jobDetails.createdAt).format("DD-MMM-YYYY")}
              </span>
            </div>
          </Card>

          <Card bodyStyle={{ padding: "16px" }} className="mt-3 fs-16">
            <h5>Job Description</h5>

            <div className="pt-2">
              <span className="fw-bold">Job Title:</span> {jobDetails.jobTitle}{" "}
              <br />
              <span className="fw-bold">Job Location:</span>{" "}
              {jobDetails.location.join(", ")}
            </div>

            {/* Responsibilities */}
            <div className="pt-3">
              <h6 className="fs-18 text-decoration-underline pb-2">
                Responsibilities:
              </h6>
              <ul>
                <li>{jobDetails.responsibility}</li>
              </ul>
            </div>

            {/* Requirements */}
            <div className="pt-2">
              <h6 className="fs-18 text-decoration-underline pb-2">
                Requirements:
              </h6>
              <div className="ps-2">
                <span className="fw-bold">Overall Experience:</span>{" "}
                {jobDetails.experience.$numberDecimal} years (min)
                <br />
                <span className="fw-bold">Number of Positions:</span>{" "}
                {jobDetails.noOfPositions}
                <br />
                <span className="fw-bold">Mandatory Experience:</span>
                <ul className="mt-1 ps-4">
                  <li>
                    Evaluate new business models and corporate relationships.
                  </li>
                  <li>
                    Negotiate complex business models, partnerships,
                    transactions, and other commercial agreements.
                  </li>
                  <li>
                    Negotiate complex business models, partnerships,
                    transactions, and other commercial agreements.
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card bodyStyle={{ padding: "16px" }} className="mt-3 fs-16">
            <table>
              <tbody>
                <tr>
                  <td className="fw-bold text-secondary">Role</td>
                  <td>{jobDetails.role}</td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary">Industry Type</td>
                  <td>{jobDetails.industryType}</td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary">Function Area</td>
                  <td>IT Software - Application Programmming, Maintainance</td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary">Employment Type</td>
                  <td>{jobDetails.employmentType}</td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary">Role Category</td>
                  <td>Programming and Design</td>
                </tr>
                <tr>
                  <td className="fw-bold pt-3">Education:</td>
                  <td className="pt-3">{jobDetails.degree}</td>
                </tr>
                {/* <tr>
                  <td className="fw-bold text-secondary"></td>
                  <td>Any Graduate in any specification</td>
                </tr>
                <tr>
                  <td className="fw-bold text-secondary"></td>
                  <td>Any Postgraduate in any specification</td>
                </tr> */}
                <tr>
                  <td className="fw-bold text-secondary">
                    Skills & Certifications
                  </td>
                  <td>{jobDetails.skillsAndQualification}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </Fragment>
      )}
    </div>
  );
};

export default JobDetails;
