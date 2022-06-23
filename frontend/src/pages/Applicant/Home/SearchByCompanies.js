import Slider from "react-slick";
import "./Home.module.css";
import { useNavigate } from "react-router-dom";

const SearchByCompanies = (props) => {
  const navigate = useNavigate();

  const routeChange = (companyName) => {
    const skill = "";
    const location = "";
    const path = `/search?skill=${skill}&location=${location}&company=${companyName}`;
    console.log(path);
    navigate(path);
  };

  return (
    <div className="mt-5">
      <h3>Select By Companies</h3>
      <div className="row mt-2">
        <Slider {...props.settings}>
          {props.companies.map((item) => (
            <div
              style={{ width: 175 }}
              className="col-12 col-sm-4 mx-5 p-3"
              key={item._id}
            >
              <img
                src={item.profileURL}
                alt="company-logo"
                className="img-responsive center-block d-block mx-auto"
                onClick={routeChange.bind(this,item.companyName)}
                role="button"
              ></img>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SearchByCompanies;
