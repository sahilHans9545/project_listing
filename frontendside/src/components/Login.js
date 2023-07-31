import React, { useState } from "react";
import "./loginSignup.css";
import { Link, useNavigate } from "react-router-dom";
import passwordIcon from "../images/password.svg";
import emailIcon from "../images/email.svg";
import { LoginUser } from "../apicalls/Login_api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div id="loginPage" className="primary-bg">
      <div>
        <div className="top-head">
          <h1>Feedback</h1>
          <p>Add your products and give us your valuable feedback</p>
        </div>

        <div className="loginSignupBox">
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              LoginUser(e, email, password)
                .then((loginResult) => {
                  if (loginResult === true) {
                    alert("Login successful!");
                    navigate("/");
                  }
                })
                .catch((error) => {
                  console.error("Error during login:", error);
                });
            }}
          >
            <div className="inputField">
              <img src={emailIcon} alt="" />
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inputField">
              <img src={passwordIcon} alt="" />
              <input
                type="text"
                placeholder="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={{ marginTop: "2.3rem", fontSize: "1.1rem" }}>
              Don’t have an account?{" "}
              <Link to="/signup" className="primary-color">
                Sign up
              </Link>
            </div>
            <div style={{ marginTop: "2.4rem" }} className="blueBtnBox">
              <button type="submit" className="blueButton primary-bg">
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
