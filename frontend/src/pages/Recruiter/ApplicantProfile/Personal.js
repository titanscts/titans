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

const Personal = (props) => {
  const applicant = props.personal;
  const address = applicant.address;

  const dataSource = [
    {
      field: "Name :",
      value: applicant.fullName,
    },
    {
      field: "Email ID :",
      value: applicant.email,
    },
    {
      field: "Mobile No :",
      value: applicant.mobile,
    },
    {
      field: "Address :",
      value: `${address.line1}, ${address.line2}, ${address.city}, ${address.state}, ${address.country} - ${address.postalcode}`,
    },
    {
      field: "Total Work Experience (In Years):",
      value: applicant.experience.$numberDecimal,
    },
    {
      field: "Skills :",
      value: applicant.skills,
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

export default Personal;
