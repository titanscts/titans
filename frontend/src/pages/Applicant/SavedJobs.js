import {
  ClockCircleOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  FireOutlined,
  ProfileOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Alert, Card, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import Moment from "moment";

const SavedJobs = (props) => {
  props.savedJobs.sort((a, b) => Moment(b.createdAt) - Moment(a.createdAt));

  const deleteFromSave = (jobId) => {
    props.deleteFromSave(jobId);
  };

  return (
    <div className="col-12 p-3">
      <div className="col-12 mb-3">
        {(!props.savedJobs || props.savedJobs.length === 0) && (
          <Alert message="You do not have any jobs saved." type="info" showIcon />
        )}
        {props.savedJobs &&
          props.savedJobs.map((item) => (
              <Card key={item._id}
                title={
                  <div style={{ padding: 4 }}>
                    <div>
                    <Link to={`/job-details/${item._id}`} >{item.jobTitle}</Link>
                      <Popconfirm
                        placement="bottomRight"
                        title="Are you sure you want to delete this job from Saved?"
                        onConfirm={deleteFromSave.bind(this, item._id)}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <i className="float-end text-danger" role="button">
                          <DeleteOutlined />
                        </i>
                      </Popconfirm>
                    </div>
                  </div>
                }
                headStyle={{ fontSize: "25px" }}
                className="shadow mb-3"
              >
                <Card type="inner" title="Epam Systems India Private Limited">
                  <div className="row fs-16">
                    <div className="col-xs-12 col-sm-3 col-md-2 col-lg-3 col-xl-2 float-start pe-0 mb-1">
                      <span>
                        <ShoppingOutlined /> {item.experience.$numberDecimal}
                        Years
                      </span>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-5 col-xl-4 float-start mb-1">
                      <span>
                        &#8377; {item.minSalary}-{item.maxSalary} PA.
                      </span>
                    </div>
                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-4 col-xl-3 float-start mb-1">
                      <span>
                        <EnvironmentOutlined /> {item.location.join(", ")}
                      </span>
                      <br />
                    </div>
                  </div>
                  <div className="row fs-16">
                    <div className="col-12 text-truncate">
                      <span>
                        <ProfileOutlined /> {item.jobDesc}
                      </span>
                    </div>
                  </div>
                  <div className="row my-1 fs-16">
                    <div className="col-12 text-truncate">
                      <span className="">{item.skillsAndQualification}</span>
                    </div>
                  </div>
                  <div className="row fs-16">
                    <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 col-xl-1 me-3">
                      <span className="badge bg-secondary">
                        <i className="text-warning">
                          <FireOutlined />
                        </i>
                        HOT JOB
                      </span>
                    </div>
                    <div className="col-xs-12 col-sm-2 col-md-2 col-lg-2 col-xl-1">
                      <span className="badge bg-secondary">
                        <ClockCircleOutlined /> Posted On
                        {Moment(item.createdAt).format("DD-MMM-YYYY")}
                      </span>
                    </div>
                  </div>
                </Card>
              </Card>
          ))}
      </div>
    </div>
  );
};

export default SavedJobs;
