const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./auth");
const user = require("./models/user");

bodyParser = require("body-parser");
const app = express();

app.use(
  cors({
    origin: "https://project-listing-wzdv.onrender.com",
  })
);

dotenv.config();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({
    message: "Success is the only option",
  });
});

// const user = mongoose.model("user", {
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     match: /.+\@.+\..+/,
//   },
//   mobile: {
//     type: String,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

const product = mongoose.model("product", {
  companyName: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  comments: {
    type: Array,
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  productLink: {
    type: String,
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
});

// *** user Registration  ***
app.post("/signup", bodyParser.json(), async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // name validation
  var usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!usernameRegex.test(name)) {
    return res
      .status(400)
      .json({ message: "Username must contain only alphanumeric characters." });
  }

  // 10 digit mobile number
  var mobileRegex = /^\d{10}$/;
  if (!mobileRegex.test(mobile)) {
    return res
      .status(400)
      .json({ message: "Invalid mobile number. It should be 10 digits." });
  }

  //  email format validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // password minimum length validation
  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: "Password must be at least 5 characters long." });
  }

  try {
    const existingUser = await user.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await user.create({
      name: name,
      email: email,
      mobile: mobile,
      password: hashedPassword,
    });
    console.log(process.env.SECRET_KEY);
    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
        mobile_num: result.mobile,
      },
      process.env.SECRET_KEY
    );
    return res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

const loginRoute = require("./routes/loginRoute");

// Use route files
app.use("/api", loginRoute);

// **** login ******

// app.post("/login", bodyParser.json(), async (req, res) => {
//   console.log(process.env.SECRET_KEY);
//   const { email, password } = req.body;

//   // //  email format validation
//   var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ message: "Invalid email format." });
//   }

//   // password minimum length validation
//   if (password.length < 5) {
//     return res
//       .status(400)
//       .json({ message: "Password must be at least 5 characters long." });
//   }

//   try {
//     const existingUser = await user.findOne({ email: email });
//     if (existingUser) {
//       const matchPassword = await bcrypt.compare(
//         password,
//         existingUser.password
//       );
//       if (!matchPassword) {
//         return res.status(400).json({ message: "Invalid Credentials" });
//       }

//       const token = jwt.sign(
//         {
//           email: existingUser.email,
//           id: existingUser._id,
//           mobile_num: existingUser.mobile,
//         },
//         process.env.SECRET_KEY
//       );
//       https: return res.status(201).json({ user: existingUser, token: token });
//     } else {
//       return res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Something went wrong !" });
//   }
// });

// Add product applyFilter
app.post("/addproduct", auth, async (req, res) => {
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
app.put("/editproduct/:id", auth, async (req, res) => {
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
app.post("/getproducts/:sortBy", bodyParser.json(), async (req, res) => {
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
app.get("/getproduct/:id", bodyParser.json(), async (req, res) => {
  try {
    const result = await product.findOne({ _id: req.params.id });

    return res.status(201).json({ product: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong !" });
  }
});

// add comment
app.put("/addcomment/:id", bodyParser.json(), async (req, res) => {
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
app.put("/incrementupvotes/:id", async (req, res) => {
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

app.use((req, res, next) => {
  const err = new Error("token not found");
  err.status = 404;
  next(err);
});

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// *** Connection with Database ***
app.listen(5000, () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`Example app listening on port 5000`);
    })
    .catch((error) => {
      console.log("connection Failed :- ", error);
    });
});
