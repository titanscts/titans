import { Segmented, Spin } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import AppliedJobs from "./AppliedJobs";
import Profile from "./Profile";
import SavedJobs from "./SavedJobs";

const Dashboard = () => {
  const location = useLocation();
  const [segment, setSegment] = useState("Profile");
  const [isLoading, setIsLoading] = useState(true);
  const [applicant, setApplicant] = useState({});

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    document.getElementById(path).click();
    getApplicant();
  }, [location.pathname]);

  const changeSegment = (value) => {
    setSegment(value);
  };

  const getApplicant = async () => {
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/applicant/applicantByToken`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
    ).json();
    if (res.status) {
      setIsLoading(false);
      setApplicant(res.data);
    }
  };

  const deleteFromSave = async (jobId) => {
    const res = await (
      await fetch(
        `${process.env.REACT_APP_HOST}/applicant/changeSaveJob/${jobId}/${false}`,
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
      const arr = [];
      applicant.savedJobs.map((job) => {
        if (job._id !== jobId) {
          arr.push(job);
        }
        return job;
      });

      applicant.savedJobs = arr;
      console.log(applicant.savedJobs);
      setApplicant((prevApplicant) => {
        prevApplicant.savedJobs = arr;
        return { ...prevApplicant };
      });
    }
  };

  return (
    <div className="container">
      <div className="row mt-5 mb-3">
        <div className="col-12">
          <Segmented
            block
            options={[
              {
                label: (
                  <div className="p-1 fw-bold" key="1">
                    <div id="profile">Profile</div>
                  </div>
                ),
                value: "Profile",
              },
              {
                label: (
                  <div className="p-1 fw-bold" key="2">
                    <div className="text-wrap" id="applications">
                      Applied Jobs
                    </div>
                  </div>
                ),
                value: "AppliedJobs",
              },
              {
                label: (
                  <div className="p-1 fw-bold" key="3">
                    <div>Saved Jobs</div>
                  </div>
                ),
                value: "SavedJobs",
              },
            ]}
            onChange={changeSegment}
          />
        </div>
      </div>

      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spin size="large" />
        </div>
      )}

      {!isLoading && (
        <div className="row">
          {segment === "Profile" && <Profile applicant={applicant} />}
          {segment === "AppliedJobs" && (
            <AppliedJobs appliedJobs={applicant.appliedJobs} />
          )}
          {segment === "SavedJobs" && (
            <SavedJobs
              savedJobs={applicant.savedJobs}
              deleteFromSave={deleteFromSave}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
