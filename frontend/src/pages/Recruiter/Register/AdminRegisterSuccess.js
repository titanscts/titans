import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const AdminRegisterSuccess = () => {
  return (
    <div className="col-12">
      <Result
        status="success"
        title="Registered successfully!"
        subTitle="Please verify email"
        extra={[
          <Link to="/login" key={1}>
            <Button type="primary" key="console">
              Login
            </Button>
          </Link>,
        ]}
      />
    </div>
  );
};

export default AdminRegisterSuccess;
