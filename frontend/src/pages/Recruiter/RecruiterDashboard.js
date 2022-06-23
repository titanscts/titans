/* eslint-disable react-hooks/exhaustive-deps */
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FireOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Card, Popconfirm, Tooltip, Alert, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import Moment from "moment";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const [postedJobs, setPostedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    getPostedJobs();
  }, []);

  const getPostedJobs = async () => {
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/recruiter/getJobsByRecruiter`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
    ).json();
    if (res.status) {
      setIsLoading(false);
      setPostedJobs(res.data);
    }
  };

  const deleteJob = async (jobId) => {
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/recruiter/deleteJobById/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
    ).json();
    if (res.status) {
      const arr = [];
      console.log(postedJobs);
      postedJobs.forEach((job) => {
        if (job._id !== jobId) {
          arr.push(job);
        }
        return job;
      });
      console.log(postedJobs);
      setPostedJobs((prevPostedJobs) => {
        prevPostedJobs = arr;
        console.log(prevPostedJobs);
        return [...prevPostedJobs];
      });
    }
  };

  postedJobs.sort((a, b) => Moment(b.createdAt) - Moment(a.createdAt));

  return (
    <div className="col-xs-10 col-sm-10 col-md-9 col-lg-8 col-xl-8 mx-auto p-3 mt-5">
      <div className="col-12">
        {isLoading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <Spin size="large" />
          </div>
        )}

        {!isLoading && (!postedJobs || postedJobs.length === 0) && (
          <Alert
            message="You have not posted any jobs yet!!"
            type="info"
            showIcon
          />
        )}
        {postedJobs &&
          postedJobs.length > 0 &&
          postedJobs.map((job) => (
            <Card
              key={job._id}
              title={
                <div className="p-1">
                  <div className=" text-wrap text-truncate">
                    <Link
                      to={`/recruiter/job-details/${job._id}`}
                      key={`details_${job._id}`}
                    >
                      {job.jobTitle}
                    </Link>
                    <Tooltip title="Delete Job" placement="top" color={"red"}>
                      <Popconfirm
                        placement="bottomRight"
                        title="Are you sure you want to delete this job?"
                        onConfirm={deleteJob.bind(this, job._id)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <i className="float-end text-danger" role="button">
                          <DeleteOutlined />
                        </i>
                      </Popconfirm>
                    </Tooltip>
                    <Link to={`/recruiter/edit-job/${job._id}`} key={job._id}>
                      <Tooltip title="Edit Job" placement="top" color={"green"}>
                        <i className="float-end green me-3" role={"button"}>
                          <EditOutlined style={{ fontSize: "80%" }} />
                        </i>
                      </Tooltip>
                    </Link>
                  </div>
                </div>
              }
              headStyle={{ fontSize: "25px" }}
              className="shadow text-truncate mb-4"
            >
              <Card
                type="inner"
                title={<div className="fw-bold fs-20">{job.companyName}</div>}
              >
                <div className="row fs-16">
                  <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 float-start pe-0 mb-1">
                    <span>
                      <ShoppingOutlined /> {job.experience.$numberDecimal} Years
                    </span>
                  </div>
                  <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3 float-start mb-1">
                    <span>
                      <WalletOutlined /> &#8377; {job.minSalary} -{" "}
                      {job.maxSalary} LPA.
                    </span>
                  </div>
                  <div className="col-xs-12 col-sm-3 col-md-6 col-lg-6 col-xl-6 float-start mb-1">
                    <span className="text-wrap">
                      <EnvironmentOutlined /> {job.location.join(", ")}
                    </span>
                    <br />
                  </div>
                </div>
                <div className="row fs-16">
                  <div className="col-12 text-truncate">
                    <span>
                      <ProfileOutlined /> {job.jobDesc}
                    </span>
                  </div>
                </div>
                <div className="row my-1 fs-16">
                  <div className="col-12 text-truncate">
                    <span className="">{job.skillsAndQualification}</span>
                  </div>
                </div>
                <div className="row fs-16">
                  <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 col-xl-1 me-3">
                    <span className="badge bg-secondary">
                      <i className="text-warning">
                        <FireOutlined />
                      </i>{" "}
                      HOT JOB{" "}
                    </span>
                  </div>
                  <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 col-xl-1">
                    <span className="badge bg-secondary">
                      <ClockCircleOutlined /> Posted On{" "}
                      {Moment(job.createdAt).format("DD-MMM-YYYY")}
                    </span>
                  </div>
                </div>
              </Card>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
