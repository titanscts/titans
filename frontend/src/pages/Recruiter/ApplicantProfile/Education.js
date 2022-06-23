import { Table } from "antd";

const columns = [
  {
    dataIndex: "field",
    key: "value",
    width: "30%",
  },
  {
    dataIndex: "value",
    key: "value",
  },
];

const Education = (props) => {
  const education = props.education;

  const dataSource = [
    {
      field: "College/University :",
      value: education.university ? education.university : "",
    },
    {
      field: "Year Passed in :",
      value: education.passingYear ? education.passingYear : "",
    },
    {
      field: "Graduated :",
      value: education.graduated ? (education.graduated ? "Yes" : "No") : "",
    },
    {
      field: "Graduate School :",
      value: education.graduateSchool ? education.graduateSchool : "",
    },
    {
      field: "Number of years attended :",
      value: education.noOfYearsAttended ? education.noOfYearsAttended : "",
    },
    {
      field: "Skills/Qualifications :",
      value: education.skills_qualification
        ? education.skills_qualification
        : "",
    },
    {
      field: "Certification :",
      value: education.certification ? education.certification : "",
    },
  ];

  return (
    <div className="col-12 p-3" style={{ fontSize: "30px" }}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    </div>
  );
};

export default Education;
