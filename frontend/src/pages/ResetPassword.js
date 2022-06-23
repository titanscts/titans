import { Alert } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const params = useParams();
  const token = params.token;

  const resetPwd = async (event) => {
    event.preventDefault();
    setError(null);
    const pwd = document.getElementById("pwd").value;
    const confirmPwd = document.getElementById("confirmPwd").value;
    if (pwd === confirmPwd) {
      const formData = new FormData();
      formData.append("password", pwd);
      const res = await (
        await fetch(`${process.env.REACT_APP_HOST}/applicant/resetPassword`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
      ).json();

      if (res.status) {
        navigate("/login");
      }
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <div className="container mt-3">
      <div className="card col-11 col-sm-11 col-md-8 col-lg-7 col-xl-6 mt-5 mx-auto shadow">
        <div className="card-header d-flex">
          <div className="col-12 mt-2 d-flex justify-content-center">
            <h4 className="text-green">Reset Password</h4>
          </div>
        </div>

        <div className="card-body px-5 pb-5">
          {error && (
            <div className="mb-3">
              <Alert message={error} type="error" showIcon />
            </div>
          )}
          <form onSubmit={resetPwd}>
            <div className="mb-3">
              <label htmlFor="pwd" className="form-label">
                Password:
              </label>
              <input
                type="password"
                className="form-control shadow-none"
                id="pwd"
                placeholder="Enter Password"
                name="pwd"
              />
            </div>

            <div className="mb-3 mt-3">
              <label htmlFor="confirmPwd" className="form-label">
                Confirm Password:
              </label>
              <input
                type="password"
                className="form-control shadow-none"
                id="confirmPwd"
                placeholder="Confirm Password"
                name="confirmPwd"
              />
            </div>

            <div className="d-flex justify-content-center">
              <button
                type="submit"
                className=" text-white bg-green w-100 mb-2 mt-2 btn px-5"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
