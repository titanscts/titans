import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Alert } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./../store/auth-context";

const Login = () => {
  const navigate = useNavigate();
  const [isPwdType, setIsPwdType] = useState(true); // true -> password
  const [error, setError] = useState(null);

  const authCtx = useContext(AuthContext);

  const togglePassword = () => {
    setIsPwdType(!isPwdType);
  };

  const login = async (event) => {
    event.preventDefault();
    setError(null);
    const type = document.getElementById("type").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pwd").value;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/${type}/login`, {
        method: "POST",
        body: formData,
      })
    ).json();

    console.log(res);
    if (res.status) {
      const userType = type === "applicant" ? 0 : 1;
      authCtx.login(res.data, userType);
      if (type === "applicant") navigate("/home");
      else navigate('/recruiter/dashboard')
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container mt-3">
      <div className="card col-11 col-sm-11 col-md-8 col-lg-7 col-xl-6 mt-5 mx-auto shadow">
        <div className="card-header d-flex">
          <div className="col-12 mt-2 d-flex justify-content-center">
            <h4 className="text-green">Login</h4>
          </div>
        </div>

        <div className="card-body px-5">
          {error && (
            <div className="mb-3">
              <Alert message={error} type="error" showIcon />
            </div>
          )}
          <form onSubmit={login}>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type:
              </label>
              <select id="type" className="form-select shadow-none">
                <option value="applicant">Applicant</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control shadow-none"
                id="email"
                placeholder="Enter email"
                name="email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="pwd" className="form-label">
                Password:
              </label>
              <div className="input-group">
                <input
                  type={isPwdType ? "password" : "text"}
                  className="form-control shadow-none"
                  id="pwd"
                  placeholder="Enter password"
                  name="pswd"
                />
                <span
                  className="input-group-text bg-white"
                  id="basic-addon2"
                  role="button"
                  onClick={togglePassword}
                >
                  {isPwdType ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </span>
              </div>
            </div>

            <div className="float-end">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div><br/>

            <div className="">
              <button
                type="submit"
                className=" text-white bg-green w-100 mb-2 mt-2 btn px-5"
              >
                {/* <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div> */}
                Login
              </button>
            </div>

            <div className="mb-1">
              <Link to="/register">Sign-Up as Applicant</Link>
            </div>
            <div className="mb-3">
              <Link to="/recruiter/register">Sing-Up as Recruiter</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
