import React, { useEffect, useState } from "react";
import MainModel from "./MainModel";
import "./homepage.css";
import companyLogo from "../images/companyLogo.png";
import commentIcon from "../images/comment.svg";
import upArrowIcon from "../images/upArrow.svg";
import EnterIcon from "../images/EnterIcon.svg";
import HomeBanner from "./HomeBanner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Homepage() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("addProduct");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("Upvotes");
  const [selectSortBy, setSelectSortBy] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [editDetails, setEditDetails] = useState({
    edit: false,
    productId: "",
  });
  const navigate = useNavigate();

  const handleModal = () => {
    if (isLoggedIn) {
      setModalType("addProduct");
    } else {
      setModalType("signup");
    }
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("bodyModalOpen");
    } else {
      document.body.classList.remove("bodyModalOpen");
    }
  }, [showModal]);

  useEffect(() => {
    // Function to check if the user is logged in
    const checkLoggedIn = () => {
      const authToken = JSON.parse(localStorage.getItem("userData"));
      console.log("authToken ", authToken);
      if (authToken) {
        setUser(JSON.parse(localStorage.getItem("userData")).user);
      }
      setIsLoggedIn(!!authToken); // Update the isLoggedIn state based on token presence
    };

    checkLoggedIn();
    getProducts();
  }, [sortBy, selectedCategories]);

  const getProducts = () => {
    axios
      .post(`http://localhost:5000/getproducts/${sortBy.toLowerCase()}`, {
        selectedCategories: selectedCategories,
      })
      .then((response) => {
        console.log(response.status);
        if (response.status === 201) {
          console.log("response is ", response.data.products);
          setProducts(response.data.products);
        }
      });
  };

  const handleDisplayComments = (id) => {
    let element = document.querySelector(`[commentsid = "${id}"]`);
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  };

  const addComment = async (e, Comment, productId) => {
    let text = e.target.previousElementSibling;
    console.log(text.value);
    console.log(Comment);
    console.log(productId);
    try {
      const result = await axios({
        method: "put",
        url: `http://localhost:5000/addcomment/${productId}`,
        data: {
          comment: text.value,
        },
      });

      console.log("result is ", result);
    } catch (err) {
      console.log(err);
    }
    let productsDummy = products;
    let index = findIndexUpdate(productsDummy, productId);
    productsDummy[index]["comments"].push(text.value);
    setProducts([...productsDummy]);
    text.value = "";
  };

  const findIndexUpdate = (productsDummy, productId) => {
    const indexToUpdate = productsDummy.findIndex(
      (obj) => obj._id === productId
    );

    return indexToUpdate;
  };

  const handleUpvotes = async (productId) => {
    try {
      await axios({
        method: "put",
        url: `http://localhost:5000/incrementupvotes/${productId}`,
      });

      let productsDummy = products;
      let index = findIndexUpdate(productsDummy, productId);
      productsDummy[index]["upvotes"]++;
      setProducts([...productsDummy]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterClick = (e, category) => {
    console.log("e os ", e);
    let updatedCategories;

    if (category === "All") {
      updatedCategories = ["All"];
    } else {
      // Toggle other categories selection
      if (selectedCategories.includes(category)) {
        e.target.classList.remove("activeFilter");
        updatedCategories = selectedCategories.filter(
          (cat) => cat !== category
        );
      } else {
        e.target.classList.add("activeFilter");
        selectedCategories.includes("All")
          ? (updatedCategories = [category])
          : (updatedCategories = [...selectedCategories, category]);
      }
    }

    setSelectedCategories(updatedCategories);
  };

  const filterOptions = [
    "Fintech",
    "Edtech",
    "B2B",
    "SaaS",
    "Agritech",
    "Meditech",
  ];

  return (
    <div id="homePage">
      {showModal && (
        <MainModel
          setShowModal={setShowModal}
          modalType={modalType}
          setModalType={setModalType}
          setIsLoggedIn={setIsLoggedIn}
          editDetails={{ ...editDetails, setEditDetails, setShowModal }}
        />
      )}
      <header className="primary-bg">
        <div className="logo">Feedback</div>
        {isLoggedIn === false ? (
          <div className="header-btns">
            <Link to="/login">Log in</Link>
            <Link to="/signup" id="signup">
              Sign up
            </Link>
          </div>
        ) : (
          <div className="header-btns">
            <Link
              to="/login"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem("userData");
                navigate("/login");
              }}
            >
              Log out
            </Link>
            <Link to="/signup">Hello {user.name}!</Link>
          </div>
        )}
      </header>
      <HomeBanner />
      <section className="mainHomeSection">
        <div className="filters-side">
          <div className="applyFilter primary-bg">
            <h3>Feedback</h3>
            <p style={{ fontWeight: "700" }}>Apply Filter</p>
          </div>
          <div className="filters desktop-filters">
            <span
              className={
                selectedCategories.includes("All") ? "activeFilter" : ""
              }
              onClick={(e) => handleFilterClick(e, "All")}
            >
              All
            </span>
            {filterOptions.map((category) => (
              <span
                key={category}
                className={
                  selectedCategories.includes(category) ? "activeFilter" : ""
                }
                onClick={(e) => handleFilterClick(e, category)}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        <div className="suggestedProjects">
          <div className="addProductBox">
            <span>{products.length} Suggestions</span>
            <p className="sortBy">
              {" "}
              <span>Sort by:</span> &nbsp;&nbsp;&nbsp;
              <div style={{ position: "relative" }} className="dflex">
                <span className="sortByValue">{sortBy}</span>
                <img
                  src={upArrowIcon}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectSortBy(!selectSortBy)}
                />
                {selectSortBy && (
                  <div className="sortFilters">
                    <div
                      onClick={() => {
                        setSortBy("Upvotes");
                        // getProducts();
                        setSelectSortBy(false);
                      }}
                    >
                      Upvotes
                    </div>
                    <div
                      onClick={() => {
                        setSortBy("Comments");
                        // getProducts();
                        setSelectSortBy(false);
                      }}
                    >
                      Comments
                    </div>
                  </div>
                )}
              </div>
            </p>
            <button id="addProductBtn" onClick={handleModal}>
              + Add Product
            </button>
          </div>
          <div className=" mobile-filters">
            <p>Filters:</p>
            <div className="filters">
              <span
                className={
                  selectedCategories.includes("All") ? "activeFilter" : ""
                }
                onClick={(e) => handleFilterClick(e, "All")}
              >
                All
              </span>
              {filterOptions.map((category) => (
                <span
                  key={category}
                  className={
                    selectedCategories.includes(category) ? "activeFilter" : ""
                  }
                  onClick={(e) => handleFilterClick(e, category)}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="Projects">
            {products &&
              products.map((product) => {
                return (
                  <div className="project">
                    <div className="flexJusBet">
                      <div className="dflex">
                        <img src={companyLogo} alt="" className="projectLogo" />
                        <div className="projectNameBox">
                          <div className="projectName primary-color">
                            {product.companyName}
                          </div>
                          <p className="projectDesc">{product.description}</p>
                        </div>
                      </div>
                      <div className="upvotes">
                        <img
                          src={upArrowIcon}
                          alt=""
                          onClick={() => {
                            handleUpvotes(product._id);
                          }}
                        />
                        <span>{product.upvotes}</span>
                      </div>
                    </div>
                    <div className="flexJusBet">
                      <div className="dflex">
                        <div className="projectTags">
                          {product.categories.map((e) => {
                            return <span>{e}</span>;
                          })}
                        </div>
                        <div
                          className="addComment"
                          onClick={() => {
                            handleDisplayComments(product._id);
                          }}
                        >
                          <img src={commentIcon} alt="" />
                          <div className="comment">Comment</div>
                        </div>
                      </div>
                      <div className="dflex">
                        {isLoggedIn === false ? (
                          ""
                        ) : (
                          <button
                            className="editBtn primary-bg"
                            onClick={() => {
                              setEditDetails({
                                edit: true,
                                productId: product._id,
                              });
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </button>
                        )}
                        <div
                          id="comments"
                          onClick={() => {
                            handleDisplayComments(product._id);
                          }}
                        >
                          <span>{product.comments.length}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              d="M23.6833 23.6833L20.9999 21H4.66659C4.02492 21 3.47542 20.7713 3.01809 20.314C2.56075 19.8566 2.33248 19.3075 2.33325 18.6666V4.66665C2.33325 4.02498 2.56192 3.47548 3.01925 3.01815C3.47659 2.56081 4.0257 2.33254 4.66659 2.33331H23.3333C23.9749 2.33331 24.5244 2.56198 24.9818 3.01932C25.4391 3.47665 25.6674 4.02576 25.6666 4.66665V22.8375C25.6666 23.3625 25.4282 23.7273 24.9514 23.9318C24.4746 24.1364 24.0519 24.0535 23.6833 23.6833Z"
                              fill="black"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div commentsid={product._id} style={{ display: "none" }}>
                      <div className="commentInput">
                        <input type="text" placeholder="Add a comment...." />
                        <img
                          src={EnterIcon}
                          alt=""
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            addComment(e, "hehhe", product._id);
                          }}
                        />
                      </div>
                      <div className="user-comments">
                        {product.comments.map((e) => {
                          return (
                            <div className="comment">
                              <div className="listDot primary-bg"></div>
                              <p>{e}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* <div className="project">
              <div className="flexJusBet">
                <div className="dflex">
                  <img src={companyLogo} alt="" className="projectLogo" />
                  <div className="projectNameBox">
                    <div className="projectName primary-color">Apna Godam</div>
                    <p className="projectDesc">
                      Provide warehouse and loan service to farmers and small
                      traders
                    </p>
                  </div>
                </div>
                <div className="upvotes">
                  <img src={upArrowIcon} alt="" />
                  <span>70</span>
                </div>
              </div>
              <div className="flexJusBet">
                <div className="dflex">
                  <div className="projectTags">
                    <span>Agritech</span>
                  </div>
                  <div className="addComment">
                    <img src={commentIcon} alt="" />
                    <div className="comment">Comment</div>
                  </div>
                </div>
                <div id="comments">
                  <span>10</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M23.6833 23.6833L20.9999 21H4.66659C4.02492 21 3.47542 20.7713 3.01809 20.314C2.56075 19.8566 2.33248 19.3075 2.33325 18.6666V4.66665C2.33325 4.02498 2.56192 3.47548 3.01925 3.01815C3.47659 2.56081 4.0257 2.33254 4.66659 2.33331H23.3333C23.9749 2.33331 24.5244 2.56198 24.9818 3.01932C25.4391 3.47665 25.6674 4.02576 25.6666 4.66665V22.8375C25.6666 23.3625 25.4282 23.7273 24.9514 23.9318C24.4746 24.1364 24.0519 24.0535 23.6833 23.6833Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="project">
              <div className="flexJusBet">
                <div className="dflex">
                  <img src={companyLogo} alt="" className="projectLogo" />
                  <div className="projectNameBox">
                    <div className="projectName primary-color">
                      Meditech India
                    </div>
                    <p className="projectDesc">
                      Fast and secure delivery of machine
                    </p>
                  </div>
                </div>
                <div className="upvotes">
                  <img src={upArrowIcon} alt="" />
                  <span>10</span>
                </div>
              </div>
              <div className="flexJusBet">
                <div className="dflex">
                  <div className="projectTags">
                    <span>Meditech</span>
                  </div>
                  <div className="addComment">
                    <img src={commentIcon} alt="" />
                    <div className="comment">Comment</div>
                  </div>
                </div>
                <div id="comments">
                  <span>2</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M23.6833 23.6833L20.9999 21H4.66659C4.02492 21 3.47542 20.7713 3.01809 20.314C2.56075 19.8566 2.33248 19.3075 2.33325 18.6666V4.66665C2.33325 4.02498 2.56192 3.47548 3.01925 3.01815C3.47659 2.56081 4.0257 2.33254 4.66659 2.33331H23.3333C23.9749 2.33331 24.5244 2.56198 24.9818 3.01932C25.4391 3.47665 25.6674 4.02576 25.6666 4.66665V22.8375C25.6666 23.3625 25.4282 23.7273 24.9514 23.9318C24.4746 24.1364 24.0519 24.0535 23.6833 23.6833Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="project">
              <div className="flexJusBet">
                <div className="dflex">
                  <img src={companyLogo} alt="" className="projectLogo" />
                  <div className="projectNameBox">
                    <div className="projectName primary-color">Razorpay</div>
                    <p className="projectDesc">Pay securely</p>
                  </div>
                </div>
                <div className="upvotes">
                  <img src={upArrowIcon} alt="" />
                  <span>120</span>
                </div>
              </div>
              <div className="flexJusBet">
                <div className="dflex">
                  <div className="projectTags">
                    <span>Fintech</span>
                    <span>B2B</span>
                  </div>
                  <div className="addComment">
                    <img src={commentIcon} alt="" />
                    <div className="comment">Comment</div>
                  </div>
                </div>
                <div id="comments">
                  <span>30</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M23.6833 23.6833L20.9999 21H4.66659C4.02492 21 3.47542 20.7713 3.01809 20.314C2.56075 19.8566 2.33248 19.3075 2.33325 18.6666V4.66665C2.33325 4.02498 2.56192 3.47548 3.01925 3.01815C3.47659 2.56081 4.0257 2.33254 4.66659 2.33331H23.3333C23.9749 2.33331 24.5244 2.56198 24.9818 3.01932C25.4391 3.47665 25.6674 4.02576 25.6666 4.66665V22.8375C25.6666 23.3625 25.4282 23.7273 24.9514 23.9318C24.4746 24.1364 24.0519 24.0535 23.6833 23.6833Z"
                      fill="black"
                    />
                  </svg>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
