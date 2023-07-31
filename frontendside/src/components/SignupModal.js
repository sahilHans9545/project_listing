import React, { useState } from "react";
import { Link } from "react-router-dom";
import passwordIcon from "../images/password.svg";
import emailIcon from "../images/email.svg";
import userIcon from "../images/user.svg";
import mobileIcon from "../images/mobile.svg";
import { RegisterUser } from "../apicalls/signup_api";

function SignupModal(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div id="signUpModal">
      <div className="modalHead">Signup to continue</div>

      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          RegisterUser(e, name, password, email, mobileNumber)
            .then((Result) => {
              if (Result === true) {
                alert("signin successful!");
                props.setModalType("addProduct");
                props.setIsLoggedIn(true);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="inputField">
          <img src={emailIcon} alt="" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="inputField">
          <img src={mobileIcon} alt="" />
          <input
            type="text"
            placeholder="Mobile"
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
        <div
          style={{
            marginTop: "1.7rem",
            paddingLeft: "5px",
            fontSize: "1.1rem",
          }}
        >
          Already have an account?
          <Link
            to="/"
            className="primary-color"
            onClick={(e) => {
              e.preventDefault();
              props.setModalType("login");
            }}
          >
            Log in
          </Link>
        </div>
        <div style={{ marginTop: "1.7rem" }} className="modalSubmitBtnBox">
          <button type="submit" className="blueButton primary-bg">
            Signup
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupModal;
