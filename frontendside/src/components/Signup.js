import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./loginSignup.css";
import { Link } from "react-router-dom";
import passwordIcon from "../images/password.svg";
import emailIcon from "../images/email.svg";
import userIcon from "../images/user.svg";
import mobileIcon from "../images/mobile.svg";
import { RegisterUser } from "../apicalls/signup_api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div id="signupPage" className="primary-bg">
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
              RegisterUser(e, name, password, email, mobileNumber)
                .then((Result) => {
                  if (Result === true) {
                    alert("signin successful!");
                    navigate("/");
                  }
                })
                .catch((error) => {
                  console.error("Error during signup", error);
                });
            }}
          >
            <div className="inputField">
              <img src={userIcon} alt="" />
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              <img src={mobileIcon} alt="" />
              <input
                type="text"
                placeholder="Mobile"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <div className="inputField">
              <img src={passwordIcon} alt="" />
              <input
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="linkBox">
              Already have an account?
              <Link to="/" className="primary-color">
                Log in
              </Link>
            </div>
            <div style={{ marginTop: "1.3rem" }} className="blueBtnBox">
              <button type="submit" className="blueButton primary-bg">
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
