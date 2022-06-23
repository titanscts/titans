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

const Employment = (props) => {
  const employment = props.employment;

  const dataSource = [
    {
      field: "Current Employer :",
      value: employment.currEmployer,
      width: "10%",
    },
    {
      field: "Current Designation :",
      value: employment.currDesignation,
    },
    {
      field: "Experience in months :",
      value: employment.currExpInMonths,
    },
    {
      field: "Job Description :",
      value: employment.currJobDescription,
    },
    {
      field: "Previous Employer :",
      value: employment.prevEmployer ? employment.prevEmployer : "",
      width: "10%",
    },
    {
      field: "Previous Designation :",
      value: employment.prevDesignation ? employment.prevDesignation : "",
    },
    {
      field: "Experience in months :",
      value: employment.prevExpInMonths ? employment.prevExpInMonths : "",
    },
    {
      field: "Job Description :",
      value: employment.prevJobDescription ? employment.prevJobDescription : "",
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

export default Employment;
