import { Button, Form, Input } from "antd";
import { Employment } from "../../../models/request/Applicant";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 4,
      offset: 1,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
    md: {
      span: 18,
    },
  },
};

/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

/* eslint-enable no-template-curly-in-string */

const EmploymentInfo = (props) => {
  const [form] = Form.useForm();

  const onFinishForm = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      const employmentInfo = new Employment(
        values["Current Employer"],
        values["Designation"],
        values["Job Description"],
        values["Experience in Months"],
        values["Previous Employer"],
        values["Previous Job Description"],
        values["Previos Experience in Months"]
      );
      props.setEmployementInfo(employmentInfo);
      props.onChange(props.current + 1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="col-12 p-5">
      <Form
        form={form}
        {...formItemLayout}
        size="large"
        labelAlign="left"
        labelWrap={true}
        colon={false}
        validateMessages={validateMessages}
        requiredMark={false}
        onFinish={onFinishForm}
      >
        <Form.Item
          label="Current Employer"
          name="Current Employer"
          htmlFor="Current Employer"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Enter Current Employer" id="Current Employer" />
        </Form.Item>
        <Form.Item
          label="Designation"
          name="Designation"
          htmlFor="Designation"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Designation" id="Designation" />
        </Form.Item>
        <Form.Item
          label="Job Description"
          name="Job Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            placeholder="Job Description"
            showCount
            maxLength={200}
            className="mb-3"
          />
        </Form.Item>
        <Form.Item
          label="Experience in Months"
          htmlFor="Months"
          name="Experience in Months"
          rules={[
            {
              min: 0,
              max: 2,
              message: "Please enter a valid number",
            },
          ]}
        >
          <Input placeholder="Months" id="Months" />
        </Form.Item>
        <Form.Item
          label="Previous Employer"
          htmlFor="Previous Employer"
          name="Previous Employer"
        >
          <Input placeholder="Enter Previous Employer" id="Previous Employer" />
        </Form.Item>
        <Form.Item
          label="Previous Job Description"
          name="Previous Job Description"
        >
          <Input.TextArea
            placeholder="Previous Job Description"
            showCount
            maxLength={200}
            className="mb-3"
          />
        </Form.Item>
        <Form.Item
          label="Experience in Months"
          htmlFor="Months"
          name="Previos Experience in Months"
        >
          <Input placeholder="Months" id="Months" />
        </Form.Item>

        <Form.Item className="justify-content-center mt-5">
          <Button type="primary" block onClick={onFinishForm}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmploymentInfo;
