import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Radio, Select, Upload } from "antd";
import { useState } from "react";
import {
  ApplicantRegistrationRequest,
  Address,
} from "../../../models/request/Applicant";

const cities = [
  "Ahmedabad",
  "Delhi",
  "Mumbai",
  "Pune",
  "Gandhinagar",
  "Surat",
  "Kolkata",
  "Hyderabad",
  "Chennai",
  "Bangalore",
  "Gurugram",
  "Indore",
  "Lucknow",
];

const states = [
  "Gujarat",
  "Rajasthan",
  "Maharashtra",
  "Tamilnadu",
  "Kerala",
  "Punjab",
  "Uttar Pradesh",
  "Madhya Pradesh",
];

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

const PersonalInfo = (props) => {
  const [file, setFile] = useState();
  const [isExperienced, setIsExperienced] = useState(false);
  const [form] = Form.useForm();

  const onChangeIsExperienced = () => {
    const isExperiencedValue = form.getFieldsValue([
      "IsExperienced",
    ]).IsExperienced;
    setIsExperienced(isExperiencedValue === "Yes");
    props.toggleExperienceInfo(isExperiencedValue === "Yes");
  };

  const beforeUpload = (file) => {
    setFile(file);
    return false;
  };

  const onFinishForm = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      const address = new Address(
        values["Address Line 1"],
        values["Address Line 2"],
        values["City"],
        values["State"],
        values["Country"],
        values["Postal code"]
      );

      const applicant = new ApplicantRegistrationRequest(
        values["Name"],
        values["Email Id"],
        values["Password"],
        values["Prefix"] + "-" + values["Mobile No"],
        values["Skills"],
        isExperienced,
        values["Experience"],
        address,
        undefined,
        undefined
      );
      props.setData({ file: file, applicant: applicant });
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
        <Form.Item label="Address" style={{ marginBottom: 0 }}>
          <Form.Item
            name="Address Line 1"
            rules={[{ required: true }]}
            style={{ width: "100%" }}
          >
            <Input placeholder="Address Line 1" />
          </Form.Item>
          <Form.Item
            name="Address Line 2"
            rules={[{ required: true }]}
            style={{
              width: "100%",
            }}
          >
            <Input placeholder="Address Line 2" />
          </Form.Item>
          <Form.Item
            name="City"
            initialValue="Ahmedabad"
            rules={[{ required: true }]}
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Select>
              {cities.map((city) => (
                <Select.Option value={city} key={city}>
                  {city}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="State"
            initialValue="Gujarat"
            rules={[{ required: true }]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Select>
              {states.map((state) => (
                <Select.Option value={state} key={state}>
                  {state}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Postal code"
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            rules={[
              {
                required: true,
                pattern: /^[1-9][0-9]{5}$/,
                message: "Please enter valid postal code",
              },
            ]}
          >
            <Input placeholder="Postal code" />
          </Form.Item>
          <Form.Item
            name="Country"
            rules={[{ required: true }]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 8px",
            }}
          >
            <Input placeholder="Country" />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Are you experienced?"
          name="IsExperienced"
          initialValue="No"
        >
          <Radio.Group onChange={onChangeIsExperienced}>
            <Radio value="Yes"> Yes </Radio>
            <Radio value="No"> No </Radio>
          </Radio.Group>
        </Form.Item>
        {isExperienced && (
          <Form.Item
            label="Experience (in years)"
            htmlFor="Experience"
            name="Experience"
            rules={[{ required: true }]}
          >
            <InputNumber
              placeholder="Experience"
              id="Experience"
              step={0.1}
              min={0}
            />
          </Form.Item>
        )}
        <Form.Item
          label="Skills"
          htmlFor="Skills"
          name="Skills"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Skills - Ex:- Html, React, Angular" id="Skills" />
        </Form.Item>
        <Form.Item
          name="upload"
          label="Resume"
          valuePropName="fileList"
          rules={[
            {
              required: true,
            },
          ]}
          getValueFromEvent={normFile}
        >
          <Upload
            name="logo"
            listType="picture"
            accept=".pdf"
            maxCount={1}
            beforeUpload={beforeUpload}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item className="justify-content-center mt-5">
          <Button type="primary" block onClick={onFinishForm}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PersonalInfo;
