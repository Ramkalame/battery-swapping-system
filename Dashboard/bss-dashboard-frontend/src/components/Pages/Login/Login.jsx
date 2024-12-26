import React from "react";
import "./Login.css";
import evlogo from "../../../assets/evlogo2.avif";
import bg1 from "../../../assets/bg8.jpg";
import cm from "../../../assets/cm.jpeg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="container-fluid vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${bg1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-img">
        <img  style={{ width: "100%", height: "100%", objectFit: "contain" }}  src={cm} alt="img"/>
      </div>
      <div className="col-lg-4 col-md-6 col-sm-8 p-5 rounded-lg shadow-lg login-box bg-black">
        <h1 className="text-center mb-4">
          <img src={evlogo} alt="" width={50} className="mb-3" />
        </h1>
        <form>
          <div className="form-group mb-4">
            <label htmlFor="email" style={{ color: "#4adda2" }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control bg-dark text-light border-secondary rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" style={{ color: "#4adda2" }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control bg-dark text-light border-secondary rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="loginBtn btn rounded w-100"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-light">
            Don't have an account?{" "}
            <a
              href="/signup"
              className=""
              style={{ fontWeight: "bold", color: "#4adda2" }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
