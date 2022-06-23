import { PoweroffOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Radio } from "antd";
import { Fragment, useState } from "react";
import { Education } from "../../../models/request/Applicant";

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

const EducationInfo = (props) => {
  const [form] = Form.useForm();
  const [isGraduated, setIsGraduated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeGraduated = () => {
    const isGraduatedValue = form.getFieldsValue(["Graduated"]).Graduated;
    setIsGraduated(isGraduatedValue === "Yes");
  };

  const onFinishForm = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      var year = values["Year Passed on"].format("YYYY");
      const educationInfo = new Education(
        values["College/University"],
        year,
        values["Graduated"] === "Yes",
        values["Graduate School"],
        values["Number of years attended"],
        values["Skills / Qualifications"],
        values["Certification"]
      );
      props.setEducationInfo(educationInfo);
      props.onChange(props.current + 1);
      setIsLoading(false);
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
          label="College / University"
          htmlFor="College/University"
          name="College/University"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            placeholder="Name of College/University attendant"
            id="College/University"
          />
        </Form.Item>
        <Form.Item
          label="Year Passed on"
          htmlFor="Year Passed on"
          name="Year Passed on"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker picker="year" format="YYYY" id="Year Passed on" />
        </Form.Item>
        <Form.Item
          label="Graduated"
          name="Graduated"
          initialValue="Yes"
          onChange={onChangeGraduated}
        >
          <Radio.Group>
            <Radio value="Yes"> Yes </Radio>
            <Radio value="No"> No </Radio>
          </Radio.Group>
        </Form.Item>
        {isGraduated && (
          <Fragment>
            <Form.Item
              label="Graduate School"
              htmlFor="Graduate School"
              name="Graduate School"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                placeholder="Name of Graduate School attended"
                id="Graduate School"
              />
            </Form.Item>
            <Form.Item
              label="Number of years attended"
              name="Number of years attended"
              htmlFor="Number of years attended"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="In Years" id="Number of years attended" />
            </Form.Item>
          </Fragment>
        )}
        <Form.Item
          label="Skills / Qualifications"
          htmlFor="Skills / Qualifications"
          name="Skills / Qualifications"
        >
          <Input.TextArea
            placeholder="Skills / Qualifications"
            showCount
            maxLength={300}
            className="mb-3"
          />
        </Form.Item>
        <Form.Item
          label="Certification"
          htmlFor="Certification"
          name="Certification"
        >
          <Input.TextArea
            placeholder="Microsoft/Online Certification"
            showCount
            maxLength={300}
            className="mb-3"
          />
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

export default EducationInfo;
