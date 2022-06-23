/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Spin, Steps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../../store/auth-context";
import PostJob from "./PostJob";
import PostJobSuccess from "./PostJobSuccess";
const { Step } = Steps;

const PostJobWrapper = () => {
  const [current, setCurrent] = useState(0);
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const params = useParams();

  const jobId = params.jobId;
  useEffect(() => {
    if (jobId) {
      getJobById();
    }
  }, [jobId]);

  const getJobById = async () => {
    setIsLoading(true);
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/recruiter/getJobById/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      })
    ).json();
    console.log(res.data);
    if (res.status) {
      setJobDetails(res.data);
      setIsLoading(false);
    }
  };

  const onChange = (value) => {
    setCurrent(value);
  };

  return (
    <div className="container mt-5">
      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <Card>
          <div className="row">
            <div className="col-12">
              <Steps
                current={current}
                responsive={false}
                labelPlacement="vertical"
              >
                <Step title="Job Details" />
                <Step title="Post Success" />
              </Steps>
            </div>
          </div>

          {current === 0 && (
            <div className="row">
              <PostJob onChange={onChange} jobDetails={jobDetails} />
            </div>
          )}

          {current === 1 && (
            <div className="row">
              <PostJobSuccess onChange={onChange} isEditMode={!!jobDetails} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default PostJobWrapper;
