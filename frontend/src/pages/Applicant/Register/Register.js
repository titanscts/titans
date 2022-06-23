import { Card, notification, Steps } from "antd";
import { useState } from "react";
import EducationInfo from "./EducationInfo";
import EmploymentInfo from "./EmploymentInfo";
import PersonalInfo from "./PersonalInfo";
import "./Register.module.css";
import RegistrationSuccess from "./RegistrationSuccess";
const { Step } = Steps;


function Register() {
  const [current, setCurrent] = useState(0);
  const [isExperienced, setIsExperienced] = useState(false);
  const [applicantData, setApplicantData] = useState(null);

  const onChange = (value) => {
    setCurrent(value);
  };

  const toggleExperienceInfo = (isHide) => {
    setIsExperienced(isHide);
  };

  const setData = (data) => {
    setApplicantData(data);
  };

  const setEmployementInfo = (data) => {
    applicantData.applicant.employment = data;
    setApplicantData(applicantData);
  };

  const setEducationInfo = (data) => {
    applicantData.applicant.education = data;
    setApplicantData(applicantData);
    registerApplicant();
  };

  const registerApplicant = async () => {
    const data = new FormData();
    console.log(applicantData);
    data.append("file", applicantData.file);
    data.append("applicant", JSON.stringify(applicantData.applicant));

    const res = await fetch(`${process.env.REACT_APP_HOST}/applicant/signUp`, {
      method: "POST",
      body: data,
    });
    const resData = await res.json();
    if (resData.status) {
      onChange(current + 1);
    } else {
      notification["error"]({
        placement: "bottomRight",
        description: `${resData.message}`,
      });
    }
    console.log(resData);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <Card>
            <div className="row">
              <div className="col-12">
                <Steps
                  current={current}
                  responsive={true}
                  labelPlacement="vertical"
                >
                  <Step title="Personal" />
                  {isExperienced && <Step title="Employment" />}
                  <Step title="Education" />
                  <Step title="Success" />
                </Steps>
              </div>
            </div>

            {current === 0 && (
              <div className="row">
                <PersonalInfo
                  onChange={onChange}
                  toggleExperienceInfo={toggleExperienceInfo}
                  setData={setData}
                  current={current}
                />
              </div>
            )}

            {current === 1 && isExperienced && (
              <div className="row">
                <EmploymentInfo
                  onChange={onChange}
                  setData={setData}
                  setEmployementInfo={setEmployementInfo}
                  current={current}
                />
              </div>
            )}

            {((isExperienced && current === 2) ||
              (!isExperienced && current === 1)) && (
              <div className="row">
                <EducationInfo
                  onChange={onChange}
                  setEducationInfo={setEducationInfo}
                  current={current}
                />
              </div>
            )}

            {(current === 3 || (!isExperienced && current === 2)) && (
              <div className="row">
                <RegistrationSuccess />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Register;
