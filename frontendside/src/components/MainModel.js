import React from "react";
import { Link } from "react-router-dom";
import passwordIcon from "../images/password.svg";
import emailIcon from "../images/email.svg";
import userIcon from "../images/user.svg";
import mobileIcon from "../images/mobile.svg";
import LoginModel from "./LoginModel";
import SignupModal from "./SignupModal";
import AddProductModel from "./AddProductModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainModel(props) {
  console.log("I am edit ", props.edit);
  return (
    <div className="mainModalOverlay">
      {/* <ToastContainer /> */}
      <div
        className="bg-overlay"
        onClick={() => {
          props.setShowModal(false);
        }}
      ></div>
      <div id="mainModal">
        <div className="modalLeft">
          {props.modalType === "login" ? (
            <LoginModel
              setModalType={props.setModalType}
              setIsLoggedIn={props.setIsLoggedIn}
            />
          ) : (
            ""
          )}
          {props.modalType === "signup" ? (
            <SignupModal
              setModalType={props.setModalType}
              setIsLoggedIn={props.setIsLoggedIn}
            />
          ) : (
            ""
          )}
          {/* companyName, categories, description, logoUrl, productLink */}
          {props.modalType === "addProduct" ? (
            <AddProductModel editDetails={props.editDetails} />
          ) : (
            ""
          )}
        </div>

        <div className="modalRight">
          <h1>Feedback</h1>
          <p>Add your product and rate other items.............</p>
        </div>
      </div>
    </div>
  );
}

export default MainModel;
