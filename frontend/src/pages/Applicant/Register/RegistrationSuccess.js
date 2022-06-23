import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const RegistrationSuccess = () => {
  return (
    <div className="col-12 mt-5">
      <Result
        status="success"
        title="Registered successfully!"
        subTitle="Please verify email"
        extra={[
          <Link to="/login">
            <Button type="primary" key="console">
              Login
            </Button>
          </Link>,
        ]}
      />
    </div>
  );
};

export default RegistrationSuccess;
