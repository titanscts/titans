import { PoweroffOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Upload } from "antd";
import { useState } from "react";
import { RecruiterRegistrationRequest } from "../../../models/request/Recruiter";

const normFile = (e) => {
  console.log("Upload event:", e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

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

const prefixSelector = (
  <Form.Item name="Prefix" noStyle initialValue="+91">
    <Select
      style={{
        width: 90,
      }}
    >
      <Select.Option value="+91">+91</Select.Option>
      <Select.Option value="+93">+93</Select.Option>
      <Select.Option value="+61">+61</Select.Option>
      <Select.Option value="+1">+1</Select.Option>
    </Select>
  </Form.Item>
);

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

const AdminRegister = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const [form] = Form.useForm();

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const onFinishForm = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);
      console.log("Success:", values);

      const recruiter = new RecruiterRegistrationRequest(
        values["Name"],
        values["Email Id"],
        values["Password"],
        values["Prefix"] + "-" + values["Mobile No"],
        values["Bio"],
        values["Company Name"]
      );

      const data = new FormData();
      data.append("file", file);
      data.append("recruiter", JSON.stringify(recruiter));

      const res = await fetch(`${process.env.REACT_APP_HOST}/recruiter/register`, {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      if (resData.status) {
        setIsLoading(false);
        props.onChange(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-12">
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
          label="Name"
          htmlFor="Name"
          name="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input id="Name" placeholder="Enter your full name" />
        </Form.Item>
        <Form.Item
          label="Email Id"
          name="Email Id"
          htmlFor="EmailId"
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input placeholder="Enter your email id" id="EmailId" />
        </Form.Item>
        <Form.Item
          label="Password"
          htmlFor="Password"
          name="Password"
          rules={[
            {
              required: true,
              min: 6,
              max: 16,
              message: "Password length should be in between 6 and 16.",
            },
            {
              pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
              message:
                "Password should be combination of alphanumeric and special characters",
            },
          ]}
        >
          <Input placeholder="Password" name="Password" id="Password" />
        </Form.Item>
        <Form.Item
          name="Mobile No"
          label="Mobile No"
          htmlFor="Mobile No"
          rules={[
            {
              required: true,
              message: "Mobile no is required",
            },
            {
              type: "number",
              message: "Please enter numbers only",
            },
            {
              pattern: /^[6-9][0-9]{9}$/,
              message: "Please enter valid mobile no",
            },
          ]}
        >
          <InputNumber
            placeholder="Mobile No"
            addonBefore={prefixSelector}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item label="Bio" name="Bio" rules={[{ required: true }]}>
          <Input.TextArea showCount maxLength={150} className="mb-3" />
        </Form.Item>
        <Form.Item
          label="Company Name"
          name="Company Name"
          htmlFor="Company Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Company Name" id="Company Name" />
        </Form.Item>
        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Upload
            name="logo"
            listType="picture"
            accept=".svg"
            maxCount={1}
            beforeUpload={beforeUpload}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item className="justify-content-center mt-5">
          {isLoading ? (
            <Button type="primary" block icon={<PoweroffOutlined />} loading />
          ) : (
            <Button type="primary" block onClick={onFinishForm}>
              Submit
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminRegister;
