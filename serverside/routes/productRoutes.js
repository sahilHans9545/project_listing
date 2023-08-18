const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../auth");
const user = require("../models/user");
const product = require("../models/product");
const router = express.Router();

// Add product applyFilter
router.post("/addproduct", auth, async (req, res) => {
  let { companyName, categories, description, logoUrl, productLink } = req.body;
  console.log(req.body);

  if (!companyName || !categories || !logoUrl || !productLink || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    categories = categories.split(",");
    const result = await product.create({
      companyName: companyName,
      categories: categories,
      description: description,
      logoUrl: logoUrl,
      productLink: productLink,
    });

    return res.status(201).json({ product: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

//  Edit Product
router.put("/editproduct/:id", auth, async (req, res) => {
  const { companyName, categories, description, logoUrl, productLink } =
    req.body;
  console.log(req.body);
  try {
    let result = await product.findOneAndUpdate(
      { _id: req.params.id },
      { companyName, categories, description, logoUrl, productLink }
    );
    return res.status(201).json({ product: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

// get products
router.post("/getproducts/:sortBy", bodyParser.json(), async (req, res) => {
  try {
    let sortby = req.params.sortBy;
    let result;
    console.log(req.body);
    const selectedCategories = req.body.selectedCategories;
    console.log(selectedCategories);
    let sortedProducts;
    if (sortby === "upvotes") {
      // Check if the selected category is "All"
      if (selectedCategories.includes("All")) {
        sortedProducts = await product.find().sort({ upvotes: -1 });
      } else {
        sortedProducts = await product
          .find({ categories: { $in: selectedCategories } })
          .sort({ upvotes: -1 });
      }
    } else if (sortby === "comments") {
      // Check if the selected category is "All"
      if (selectedCategories.includes("All")) {
        sortedProducts = await product.aggregate([
          {
            $addFields: {
              commentsCount: { $size: { $ifNull: ["$comments", []] } },
            },
          },
          { $sort: { commentsCount: -1 } },
        ]);
      } else {
        sortedProducts = await product.aggregate([
          { $match: { categories: { $in: selectedCategories } } },
          {
            $addFields: {
              commentsCount: { $size: { $ifNull: ["$comments", []] } },
            },
          },
          { $sort: { commentsCount: -1 } },
        ]);
      }
    }

    return res.status(201).json({ products: sortedProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

//  get Single Product
router.get("/getproduct/:id", bodyParser.json(), async (req, res) => {
  try {
    const result = await product.findOne({ _id: req.params.id });

    return res.status(201).json({ product: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

// add comment
router.put("/addcomment/:id", bodyParser.json(), async (req, res) => {
  const { comment } = req.body;
  try {
    let doc = await product.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { comments: comment } }
    );
    return res.status(201).json({ product: doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

// Increment Upvotes
router.put("/incrementupvotes/:id", async (req, res) => {
  try {
    let doc = await product.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { upvotes: 1 } }
    );
    return res.status(201).json({ product: doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

module.exports = router;
