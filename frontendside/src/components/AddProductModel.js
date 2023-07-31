import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AddProductModel(props) {
  const [companyName, setCompanyName] = useState("");
  const [categories, setCategories] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [productLink, setProductLink] = useState("");

  useEffect(() => {
    if (props.editDetails.edit === true) {
      const getProduct = () => {
        axios
          .get(
            `https://project-listing-backend-v0lp.onrender.com/getproduct/${props.editDetails.productId}`
          )
          .then((response) => {
            console.log(response.status);
            if (response.status === 201) {
              console.log("response is ", response);
              setCompanyName(response.data.product.companyName);
              setDescription(response.data.product.description);
              setLogoUrl(response.data.product.logoUrl);
              setProductLink(response.data.product.productLink);
              setCategories(response.data.product.categories);
            }
          });
      };
      getProduct();
    }
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const authToken = JSON.parse(localStorage.getItem("userData")).authToken;
    // console.log("first ", token);
    await axios({
      method: "post",
      url: "https://project-listing-backend-v0lp.onrender.com/addproduct",
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the token in the 'Authorization' header
      },
      data: {
        companyName,
        categories,
        description,
        logoUrl,
        productLink,
      },
    })
      .then((msg) => {
        console.log(msg);
        setCompanyName("");
        setDescription("");
        setLogoUrl("");
        setProductLink("");
        setCategories("");
        toast.success("Product added Succesfully");
        return true;
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        return false;
      });
  };

  const editProduct = async (e) => {
    e.preventDefault();
    const authToken = JSON.parse(localStorage.getItem("userData")).authToken;
    await axios({
      method: "put",
      url: `https://project-listing-backend-v0lp.onrender.com/editproduct/${props.editDetails.productId}`,
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the token in the 'Authorization' header
      },
      data: {
        companyName,
        categories,
        description,
        logoUrl,
        productLink,
      },
    })
      .then((msg) => {
        console.log(msg);
        alert("Product Updated Succesfully");
        props.editDetails.setEditDetails({ edit: false, productId: "" });
        props.editDetails.setShowModal(false);
        return true;
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        return false;
      });
  };

  return (
    <div id="addproductModal">
      <div className="modalHead">
        {props.editDetails.edit === true ? "Edit" : "Add"} your product{" "}
      </div>

      <form
        action=""
        onSubmit={props.editDetails.edit === true ? editProduct : addProduct}
      >
        <div className="inputField">
          <input
            type="text"
            placeholder="Name of the company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="inputField">
          <input
            type="text"
            placeholder="Category"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />
        </div>
        <div className="inputField">
          <input
            type="text"
            placeholder="Add logo url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>
        <div className="inputField">
          <input
            type="text"
            placeholder="Link of product"
            value={productLink}
            onChange={(e) => setProductLink(e.target.value)}
          />
        </div>
        <div className="inputField">
          <input
            type="text"
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "2.5rem" }} className="modalSubmitBtnBox">
          <button type="submit" className="blueButton primary-bg">
            {props.editDetails.edit === true ? "Update" : "+Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductModel;
