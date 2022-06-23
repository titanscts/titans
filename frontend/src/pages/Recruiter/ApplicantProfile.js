import { Alert, Segmented, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Education from "./ApplicantProfile/Education";
import Employment from "./ApplicantProfile/Employment";
import Personal from "./ApplicantProfile/Personal";

const ApplicantProfile = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [segment, setSegment] = useState("Personal");
  const [applicant, setApplicant] = useState({});

  const changeSegment = (value) => {
    setSegment(value);
  };

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    getApplicantDetails();
  }, []);

  const getApplicantDetails = async () => {
    const resData = await (
      await fetch(
        `${process.env.REACT_APP_HOST}/applicant/applicantById/${params.applicantId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        }
      )
    ).json();
    setIsLoading(false);
    setApplicant(resData.data);
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
                  <div className="p-1 fw-bold">
                    <div>Personal</div>
                  </div>
                ),
                value: "Personal",
              },
              {
                label: (
                  <div className="p-1 fw-bold">
                    <div className="text-wrap">Employment</div>
                  </div>
                ),
                value: "Employment",
              },
              {
                label: (
                  <div className="p-1 fw-bold">
                    <div>Education</div>
                  </div>
                ),
                value: "Education",
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
          {segment === "Personal" && <Personal personal={applicant} />}
          {segment === "Employment" &&
            (applicant.employment ? (
              <Employment employment={applicant.employment} />
            ) : (
              <Alert type="info" message="No employment details found"></Alert>
            ))}
          {segment === "Education" && (
            <Education education={applicant.education} />
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicantProfile;
