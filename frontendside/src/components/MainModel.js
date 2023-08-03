import React from "react";
import LoginModel from "./LoginModel";
import SignupModal from "./SignupModal";
import AddProductModel from "./AddProductModel";
import "react-toastify/dist/ReactToastify.css";

function MainModel(props) {
  console.log("I am edit ", props.edit);
  return (
    <div className="mainModalOverlay">
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
          {props.modalType === "addProduct" ? (
            <AddProductModel
              editDetails={props.editDetails}
              setProducts={props.setProducts}
              getProducts={props.getProducts}
            />
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
