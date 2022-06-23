import { Card, Steps } from "antd";
import { useState } from "react";
import AdminRegister from "./AdminRegister";
import AdminRegisterSuccess from "./AdminRegisterSuccess";
const { Step } = Steps;

const AdminRegisterWrapper = () => {
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    setCurrent(value);
  };

  return (
    <div className="container mt-5">
      <Card>
        <div className="row">
          <div className="col-10 mx-auto">
            <Steps
              current={current}
              responsive={false}
              labelPlacement="vertical"
            >
              <Step title="Registration Details" />
              <Step title="Resistration Success" />
            </Steps>
          </div>
        </div>

        <div className="row mt-5">
          {current === 0 && <AdminRegister onChange={onChange}/>}
          {current === 1 && <AdminRegisterSuccess />}
        </div>
      </Card>
    </div>
  );
};

export default AdminRegisterWrapper;
