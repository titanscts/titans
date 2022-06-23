import {
  DeleteOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Collapse,
  Input,
  notification,
  Popconfirm,
  Spin,
  Table,
} from "antd";
import Moment from "moment";
import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./JobDetails.module.css";

const { Panel } = Collapse;

const columns = [
  {
    title: "Name",
    dataIndex: "",
    render: (applicant) => (
      <Link to={`/recruiter/applicant-profile/${applicant.id}`}>
        {applicant.name}
      </Link>
    ),
    width: "15%",
  },
  {
    title: "Experience (Years)",
    dataIndex: "experience",
    width: "15%",
    sorter: (a, b) => a.experience - b.experience,
  },
  {
    title: "Skills",
    dataIndex: "skills",
    width: "40%",
  },
  {
    title: "Address",
    dataIndex: "address",
    width: "20%",
  },
  {
    title: "Resume",
    dataIndex: "",
    render: (applicant) => (
      <a
        href={`${applicant.resumeURL}`}
        target="_blank"
        rel="noreferrer"
        className="text-primary"
        download
      >
        <DownloadOutlined />
      </a>
    ),
    width: "10%",
  },
];

const JobDetails = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const params = useParams();
  const jobId = params.jobId;
  let dataSource = [];
  if (jobDetails) {
    dataSource = jobDetails.applicantsApplied.map((applicant) => {
      const { city, state, country } = applicant.address;
      const experience = applicant.experience.$numberDecimal;
      const applicantDetail = {
        id: applicant._id,
        name: applicant.fullName,
        experience: experience ? experience : 0,
        skills: applicant.skills,
        address: city + ", " + state + ", " + country,
        resumeURL: applicant.resumeURL,
      };
      return applicantDetail;
    });
  }

  const filter = () => {
    const filterText = document
      .getElementById("filterText")
      .value.toLowerCase();
    const dataSource = dataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(filterText) ||
        item.experience.toLowerCase().includes(filterText) ||
        item.skills.toLowerCase().includes(filterText) ||
        item.address.toLowerCase().includes(filterText)
    );
  };

  useEffect(() => {
    getJobDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getJobDetails = async () => {
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/recruiter/getJobById/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
    ).json();
    if (res.status) {
      setJobDetails(res.data);
      setIsLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      if (jobId) {
        const res = await (
          await fetch(
            `${process.env.REACT_APP_HOST}/recruiter/deleteJobById/${jobId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authCtx.token}`,
              },
            }
          )
        ).json();
        if (res.status) {
          navigate("/recruiter/dashboard");
        } else {
          notification["error"]({
            placement: "bottomRight",
            description: `${res.message}`,
          });
        }
      }
    } catch (err) {
      notification["error"]({
        placement: "bottomRight",
        description: `${err.message}`,
      });
    }
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
              <span className="float-end mx-4 pt-1">
                <Popconfirm
                  placement="topRight"
                  title="Are you sure you want to delete this job?"
                  onConfirm={deleteJob.bind(this, jobDetails._id)}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <i className="float-end text-danger" role="button">
                    <DeleteOutlined />
                  </i>
                </Popconfirm>
              </span>
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
                  <Link to={`/recruiter/edit-job/${jobDetails._id}`}>
                    <Button
                      type="primary"
                      size="large"
                      className="position-absolute bottom-0 end-0 translate-middle"
                    >
                      Edit
                    </Button>
                  </Link>
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

          <Card bodyStyle={{ padding: "16px" }} className="mt-3">
            <Collapse accordion>
              <Panel header="View Applicants" key="1" className="fs-16 fw-bold">
                <div
                  className="d-sm-none d-md-block float-end"
                  style={{ width: "200px" }}
                >
                  {/* <Input
                    id="filterText"
                    placeholder="Search"
                    className="fs-12 p-1 fs-14 me-4 mb-2"
                    onKeyUp={filter}
                  /> */}
                </div>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  rowKey={(data) => data.name}
                  pagination={{
                    defaultPageSize: "5",
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
                    showSizeChanger: true,
                    locale: { items_per_page: "" },
                  }}
                  scroll={{
                    x: 700,
                    y: 400,
                  }}
                  size="middle"
                  className="fw-normal"
                />
              </Panel>
            </Collapse>
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
                {jobDetails.experience.$numberDecimal}
                years (min)
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
