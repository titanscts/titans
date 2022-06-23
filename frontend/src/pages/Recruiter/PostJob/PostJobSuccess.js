import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const PostJobSuccess = (props) => {
  return (
    <div className="col-12 mt-5">
      <Result
        status="success"
        title={`${
          props.isEditMode
            ? "Job updated successfully!"
            : "Job posted successfully!"
        }`}
        extra={[
          <Link to="/recruiter/dashboard" key="view">
            <Button type="primary">View jobs</Button>
          </Link>,
          <Button onClick={props.onChange.bind(this, 0)} key="buy">
            Post new job
          </Button>,
        ]}
      />
    </div>
  );
};

export default PostJobSuccess;
