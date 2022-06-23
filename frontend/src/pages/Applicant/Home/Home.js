import { Button, Input, Spin } from "antd";
import { Fragment, useEffect, useState } from "react";
import CareerTips from "./CareerTips";
import "./Home.module.css";
import HotJobs from "./HotJobs";
import SearchByCompanies from "./SearchByCompanies";
import { useNavigate } from "react-router-dom";

const settings = {
  className: "slider variable-width",
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  rtl: false,
  variableWidth: true,
  adaptiveHeight: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Home = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    hotJobs: [],
    careerTips: [],
    companies: [],
  });

  useEffect(() => {
    getHomeDetails();
  }, []);

  const getHomeDetails = () => {
    fetch(`${process.env.REACT_APP_HOST}/applicant/homeDetails`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((resData) => {
        setHomeData(resData.data);
        setIsLoading(false);
      })
      .catch((err) => {});
  };

  const routeChange = () => {
    const skill = document.getElementById("skill").value;
    const location = document.getElementById("location").value;
    const companies = "";
    const path = `/search?skill=${skill}&location=${location}&company=${companies}`;
    navigate(path);
  };

  return (
    <div className="container mt-4">
      <h1 className="green text-center">Titans</h1>

      {/* Find jobs */}
      <div className="row">
        <div className="col-12 col-sm-12 col-md-9 mx-auto">
          <div className="row">
            <div className="col-6 col-sm-4 mt-2">
              <Input
                placeholder="Skill"
                className="py-2 px-3 border-dark border-2 fs-18 shadow"
                id="skill"
              />
            </div>
            <div className="col-6 col-sm-4 mt-2">
              <Input
                placeholder="Location"
                className="py-2 px-3 border-dark border-2 fs-18 shadow"
                id="location"
              />
            </div>
            <div className="col-12 col-sm-4 mt-2">
              <Button
                type="primary w-100 h-100 fw-bold fs-18 shadow"
                size="large"
                onClick={routeChange}
              >
                Find Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <Fragment>
          <HotJobs settings={settings} hotJobs={homeData.hotJobs} />
          <SearchByCompanies
            settings={settings}
            companies={homeData.companies}
          />
          <CareerTips careerTips={homeData.careerTips} />
        </Fragment>
      )}
    </div>
  );
};

export default Home;
