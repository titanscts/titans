import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
} from "antd";
import Moment from "moment";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { PostJobRequest } from "../../../models/request/Recruiter";
import AuthContext from "./../../../store/auth-context";

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

const options = [
  {
    label: "UG",
    value: "UG",
  },
  {
    label: "PG",
    value: "PG",
  },
  {
    label: "PhD",
    value: "PhD",
  },
];

const marks = {
  0: "0 LPA",
  10: "10 LPA",
  25: "25 LPA",
  50: "50 LPA",
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

const disabledDate = (current) => {
  return current && current < moment().subtract(1, "days");
};

const PostJob = (props) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (props.jobDetails) {
      const jobDetails = props.jobDetails;
      form.setFieldsValue({
        "Job Id": jobDetails.jobId,
        "Job Title": jobDetails.jobTitle,
        "Job Posted Date": Moment(jobDetails.updatedAt),
        Role: jobDetails.role,
        Responsibility: jobDetails.responsibility,
        "Company Name": jobDetails.companyName,
        Experience: jobDetails.experience.$numberDecimal,
        "Salary Range": [jobDetails.minSalary, jobDetails.maxSalary],
        "Number of Positions": jobDetails.noOfPositions,
        Location: jobDetails.location,
        "Skills and Qualifications": jobDetails.skillsAndQualification,
        Degree: jobDetails.degree,
        "Company Info": jobDetails.companyInfo,
        "Employment Type": jobDetails.employmentType,
        "Industry Type": jobDetails.industryType,
        "Search Keyword": jobDetails.searchKeyword,
        "Job Description": jobDetails.jobDesc,
      });
    }
  }, [form, props.jobDetails]);

  const authCtx = useContext(AuthContext);

  const onFinishForm = async () => {
    try {
      const values = await form.validateFields();
      const job = new PostJobRequest(
        props.jobDetails ? props.jobDetails._id : undefined,
        values["Job Id"],
        values["Job Title"],
        values["Role"],
        values["Responsibility"],
        values["Company Name"],
        values["Experience"],
        values["Salary Range"][0],
        values["Salary Range"][1],
        values["Number of Positions"],
        values["Location"],
        values["Skills and Qualifications"],
        values["Degree"],
        values["Company Info"],
        values["Employment Type"],
        values["Industry Type"],
        values["Search Keyword"],
        values["Job Description"]
      );

      const data = new FormData();
      data.append("job", JSON.stringify(job));
      console.log(job);
      const res = await (
        await fetch(`${process.env.REACT_APP_HOST}/recruiter/postJob`, {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${authCtx.token}`,
          },
        })
      ).json();

      if (res.status) {
        props.onChange(1);
      } else {
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-12 mt-5">
      {error.lenth > 0 && <Alert message={error} type="error" showIcon />}
      <Form
        {...formItemLayout}
        size="large"
        labelAlign="left"
        labelWrap={true}
        colon={false}
        validateMessages={validateMessages}
        requiredMark={false}
        form={form}
      >
        <Form.Item
          label="Job Id"
          htmlFor="Job Id"
          name="Job Id"
          rules={[
            {
              required: true,
            },
            {
              min: 12,
              max: 12,
              message: "Please enter job id 12 characters long",
            },
          ]}
        >
          <Input id="Job Id" placeholder="Enter your job id" />
        </Form.Item>

        <Form.Item
          label="Job Title"
          htmlFor="Job Title"
          name="Job Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Job Title" id="Job Title" />
        </Form.Item>

        <Form.Item
          label="Job Posted Date"
          name="Job Posted Date"
          htmlFor="Job Posted Date"
          rules={[{ required: true }]}
        >
          <DatePicker disabledDate={disabledDate} id="Job Posted Date" />
        </Form.Item>

        <Form.Item
          name="Role"
          label="Role"
          htmlFor="Role"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Role" id="Role" />
        </Form.Item>

        <Form.Item
          label="Responsibility"
          name="Responsibility"
          rules={[{ required: true }]}
        >
          <Input.TextArea showCount maxLength={300} className="mb-3" />
        </Form.Item>

        <Form.Item
          label="Salary Range (in LPA)"
          name="Salary Range"
          style={{ marginBottom: 0 }}
          initialValue={[2, 10]}
        >
          <Slider range={true} marks={marks} included={true} max={50} />
        </Form.Item>

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

        <Form.Item
          label="Number of Positions"
          htmlFor="Number of Positions"
          name="Number of Positions"
          rules={[{ required: true }]}
        >
          <InputNumber
            placeholder="Number of Positions"
            id="Number of Positions"
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="Location"
          htmlFor="Location"
          name="Location"
          rules={[
            {
              required: true,
              message: "Please select atleast one location",
              type: "array",
            },
          ]}
        >
          <Select mode="multiple" placeholder="Loocation">
            {cities.map((city) => (
              <Select.Option value={city} key={city}>
                {city}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Skills and Qualifications"
          htmlFor="Skills and Qualifications"
          name="Skills and Qualifications"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            placeholder="Skills and Qualifications"
            id="Skills and Qualifications"
          />
        </Form.Item>

        <Form.Item
          label="Degree"
          htmlFor="Degree"
          name="Degree"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group
            value="UG"
            options={options}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        <Form.Item
          label="Company Name"
          htmlFor="Company Name"
          name="Company Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Company Name" id="Company Name" />
        </Form.Item>

        <Form.Item
          label="Company Info"
          htmlFor="Company Info"
          name="Company Info"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Company Info" id="Company Info" />
        </Form.Item>

        <Form.Item
          name="Employment Type"
          label="Employment Type"
          initialValue="Full Time"
          rules={[{ required: true }]}
        >
          <Select placeholder="Full Time / Part Time">
            <Select.Option value="Full Time">Full Time</Select.Option>
            <Select.Option value="Part Time">Part Time</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Industry Type"
          label="Industry Type"
          initialValue="Hardware"
          rules={[{ required: true }]}
        >
          <Select placeholder="Hardware / Software">
            <Select.Option value="Hardware">Hardware</Select.Option>
            <Select.Option value="Software">Software</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Search Keyword"
          htmlFor="Search Keyword"
          name="Search Keyword"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="Search Keyword" id="Search Keyword" />
        </Form.Item>

        <Form.Item
          label="Job Description"
          name="Job Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea showCount maxLength={500} className="mb-3" />
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

export default PostJob;
