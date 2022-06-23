/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  FireOutlined,
  ProfileOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Collapse, Spin } from "antd";
import Moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const { Panel } = Collapse;

const Filter = () => {
  const [filters, setFilters] = useState({
    locations: [],
    companies: [],
    salaries: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchedJobs, setSearchedJobs] = useState([]);
  const [data, setData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const skill = searchParams.get("skill");
  const location = searchParams.get("location");
  const company = searchParams.get("company");

  const getFilterData = async () => {
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/applicant/filterData`, {
        method: "GET",
      })
    ).json();
    if (res.status) {
      console.log(res);
      setData(res.data);
    }
  };

  const getSearchedJobs = async () => {
    const res = await (
      await fetch(
        `${process.env.REACT_APP_HOST}/applicant/search?skill=${skill}&location=${location}&company=${company}`,
        {
          method: "GET",
        }
      )
    ).json();
    if (res.status) {
      setSearchedJobs(res.data);
      setIsLoading(false);
    }
  };

  const onLocationSelect = (checkedValues) => {
    setFilters((prevFilter) => {
      prevFilter.locations = checkedValues;
      console.log(prevFilter);
      return prevFilter;
    });
  };

  const onCompanySelect = (checkedValues) => {
    setFilters((prevFilter) => {
      prevFilter.companies = checkedValues;
      return prevFilter;
    });
  };

  const onSalaryRangeSelect = (checkedValues) => {
    setFilters((prevFilter) => {
      prevFilter.salaries = checkedValues;
      return prevFilter;
    });
  };

  const applyFilter = async (event) => {
    event.stopPropagation();
    try {
      const formData = new FormData();
      formData.append("filters", JSON.stringify(filters));
      const res = await (
        await fetch(`${process.env.REACT_APP_HOST}/applicant/filterJobs?skill=${skill}&location=${location}&company=${company}`, {
          method: "POST",
          body: formData,
        })
      ).json();
      if (res.status) {
        console.log(res);
        setSearchedJobs(res.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    getFilterData();
    getSearchedJobs();
  }, []);

  return (
    <div className="container">
      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <div className="row">
          <div className="col-12 col-lg-3 p-3">
            <div className="row fs-20">
              <div className="col-12 my-2">
                <Collapse accordion defaultActiveKey={['1']}>
                  <Panel
                    header={<div className="fw-bold">Filter</div>}
                    key="1"
                    className="fs-16"
                    extra={
                      <Button type="primary" onClick={applyFilter.bind(this)}>
                        Apply
                      </Button>
                    }
                  >
                    <Card bodyStyle={{ padding: "1px" }}>
                      <Card
                        title="By Location"
                        bordered={false}
                        bodyStyle={{ padding: "10px" }}
                      >
                        <Checkbox.Group
                          style={{
                            width: "100%",
                          }}
                          onChange={onLocationSelect}
                        >
                          {data.locations &&
                            data.locations.length > 0 &&
                            data.locations.map((location) => (
                              <Fragment>
                                <Checkbox
                                  className="ms-3"
                                  value={location.location}
                                >
                                  {location.location} ({location.count})
                                </Checkbox>
                                <br />
                              </Fragment>
                            ))}
                        </Checkbox.Group>
                      </Card>
                      <hr></hr>
                      <Card
                        title="By Salary Range"
                        bordered={false}
                        bodyStyle={{ padding: "10px" }}
                      >
                        <Checkbox.Group
                          style={{
                            width: "100%",
                          }}
                          onChange={onSalaryRangeSelect}
                        >
                          {data.salaries &&
                            data.salaries.length > 0 &&
                            data.salaries.map((salary) => (
                              <Fragment>
                                <Checkbox className="ms-3" value={salary.range}>
                                  {salary.range} LPA. ({salary.count})
                                </Checkbox>
                                <br />
                              </Fragment>
                            ))}
                        </Checkbox.Group>
                      </Card>
                      <hr></hr>
                      <Card
                        title="By Company"
                        bordered={false}
                        bodyStyle={{ padding: "10px" }}
                      >
                        <Checkbox.Group
                          style={{
                            width: "100%",
                          }}
                          onChange={onCompanySelect}
                        >
                          {data.companies &&
                            data.companies.length > 0 &&
                            data.companies.map((company) => (
                              <Fragment>
                                <Checkbox className="ms-3" value={company._id}>
                                  {company._id} ({company.count})
                                </Checkbox>
                                <br />
                              </Fragment>
                            ))}
                        </Checkbox.Group>
                      </Card>
                    </Card>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-9 p-3">
            <div className="col-12">
              <div className="mb-4">
                {searchedJobs.length == 0 && (
                  <Alert
                    message="No jobs found matching your search criteria!!!"
                    type="info"
                    showIcon
                    className="mt-2"
                  />
                )}
                {searchedJobs &&
                  searchedJobs.length > 0 &&
                  searchedJobs.map((job) => (
                    <Card
                      title={
                        <Link to={`/job-details/${job._id}`}>
                          {job.jobTitle}
                        </Link>
                      }
                      headStyle={{ fontSize: "25px" }}
                      className="shadow mb-4"
                    >
                      <Card type="inner" title={job.companyName}>
                        <div className="row fs-16">
                          <div className="col-xs-12 col-sm-3 col-md-2 col-lg-3 col-xl-2 float-start pe-0 mb-1">
                            <span>
                              <ShoppingOutlined />{" "}
                              {job.experience.$numberDecimal} Years (min)
                            </span>
                          </div>
                          <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-2 float-start mb-1">
                            <span>
                              &#8377; {job.minSalary}-{job.maxSalary} LPA.
                            </span>
                          </div>
                          <div className="col-xs-12 col-sm-6 col-md-7 col-lg-6 col-xl-8 float-start mb-1 text-truncate">
                            <span>
                              <EnvironmentOutlined /> {job.location.join(", ")}
                            </span>
                            <br />
                          </div>
                        </div>
                        <div className="row fs-16">
                          <div className="col-12 text-truncate">
                            <span>
                              <ProfileOutlined /> {job.jobDesc}
                            </span>
                          </div>
                        </div>
                        <div className="row my-1 fs-16">
                          <div className="col-12 text-truncate">
                            <span className="">
                              {job.skillsAndQualification}
                            </span>
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
                              <ClockCircleOutlined /> Posted on :{" "}
                              {Moment(job.createdAt).format("DD-MMM-YYYY")}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
