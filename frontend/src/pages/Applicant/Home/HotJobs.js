/* eslint-disable eqeqeq */
import { Card } from "antd";
import Slider from "react-slick";
import "./Home.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../../store/auth-context";

const HotJobs = (props) => {
  const authCtx = useContext(AuthContext);
  const isAdmin = authCtx.type == 1;

  let jobDetailsRoute = (isAdmin ? "/recruiter" : "") + "/job-details";

  return (
    <div className="mt-5">
      <h3>Hot Jobs</h3>
      <div className="row">
        <Slider {...props.settings}>
          {props.hotJobs.map((item) => (
            <Link to={`${jobDetailsRoute}/${item._id}`} key={item._id}>
              <div style={{ width: 300 }} className="px-2">
                <Card
                  bordered={false}
                  loading={false}
                  hoverable={true}
                  bodyStyle={{ padding: "22px 18px", margin: "0 5px" }}
                >
                  <div className="text-truncate fw-bold fs-18">
                    {item.jobTitle}
                  </div>
                  <div className="text-truncate fs-16 text-secondary mt-1">
                    {item.skillsAndQualification}
                  </div>
                  <div className="fs-15 text-dark mt-1">
                    Experience: {item.experience.$numberDecimal} Years
                  </div>
                  <div className="text-truncate fs-15 text-dark mt-1">
                    Location(s): {item.location.join(", ")}
                  </div>
                </Card>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default HotJobs;
