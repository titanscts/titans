import { Badge, Card } from "antd";
import Moment from "moment";

const CareerTips = (props) => {
  return (
    <div className="mt-4">
      <h3>Career Tips</h3>
      <div className="row">
        {props.careerTips.map((item, index) => (
          <div className="col-12 col-sm-6 mt-2" key={item._id}>
            <a href={item.tipURL} target="_blank">
              <Badge.Ribbon text={`#${index + 1}`} color="primary">
                <Card
                  bodyStyle={{ padding: "5px 18px 18px 18px" }}
                  hoverable={true}                
                >
                  <span className="fs-12 text-green fw-bold">
                    {Moment(item.updatedAt).format("DD-MMM-YYYY")}
                  </span>
                  <div className="fs-16 fw-bold text-secondary mt-1 text-truncate">
                    {item.tip}
                  </div>
                </Card>
              </Badge.Ribbon>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerTips;
