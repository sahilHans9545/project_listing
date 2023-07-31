import React, { useState } from "react";
import passwordIcon from "../images/password.svg";
import emailIcon from "../images/email.svg";
import { Link } from "react-router-dom";
import { LoginUser } from "../apicalls/Login_api";

function LoginModel(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div id="loginModal">
      <div className="modalHead">Log in to continue</div>

      <form
        action=""
        onSubmit={async (e) => {
          e.preventDefault();

          LoginUser(e, email, password)
            .then((loginResult) => {
              if (loginResult === true) {
                alert("Login successful!");
                props.setModalType("addProduct");
                props.setIsLoggedIn(true);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            marginTop: "1.9rem",
            paddingLeft: "5px",
            fontSize: "1.1rem",
          }}
        >
          Don’t have an account?
          <Link
            to="/"
            className="primary-color"
            onClick={(e) => {
              e.preventDefault();
              props.setModalType("signup");
            }}
          >
            Sign up
          </Link>
        </div>

        <div style={{ marginTop: "3.15rem" }} className="modalSubmitBtnBox">
          <button type="submit" className="blueButton primary-bg">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginModel;
