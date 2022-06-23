import { Alert } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const forgotPwd = async (event) => {
    event.preventDefault();
    setError(null);
    const type = document.getElementById("type").value;
    const email = document.getElementById("email").value;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("type", type);
    const res = await (
      await fetch(`${process.env.REACT_APP_HOST}/applicant/forgotPassword`, {
        method: "POST",
        body: formData,
      })
    ).json();

    if (res.status) {
      setSuccess(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container mt-3">
      <div className="card col-11 col-sm-11 col-md-8 col-lg-7 col-xl-6 mt-5 mx-auto shadow">
        <div className="card-header d-flex">
          <div className="col-12 mt-2 d-flex justify-content-center">
            <h4 className="text-green">Forgot Password</h4>
          </div>
        </div>

        <div className="card-body px-5 pb-5">
          {error && (
            <div className="mb-3">
              <Alert message={error} type="error" showIcon />
            </div>
          )}
          {success && (
            <div className="mb-3">
              <Alert message={success} type="success" showIcon />
            </div>
          )}

          <form onSubmit={forgotPwd}>
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

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className=" text-white bg-green w-100 mb-2 mt-2 btn px-5"
              >
                Send Email
              </button>
            </div>
          </form>

          <div className="my-2">
            <Link to="/login">Back to Login page</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
