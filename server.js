const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
// const DATABASE = process.env.DATABASE;
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB locally
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once("open", () => {
  console.log("Successfully connected to the database");
});

// Configure body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./arabic/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./arabic/build/index.html"));
});

// Enable CORS
app.use(cors());

// Define a schema
const formSchema = new mongoose.Schema({
  firstname: String,
  secondName: String,
  lastname: String,
  phonenumber: String,
  typeOfTransaction: String,
  departmentName: String,
  date: String
});

// Create a model
const FormModel = mongoose.model("Form", formSchema);

// Define a route to handle form submission
app.post("/submitdata", async (req, res) => {
  try {
    // Create a new instance of the model with form data
    const formData = new FormModel({
      firstname: req.body.firstname,
      secondName: req.body.secondName,
      lastname: req.body.lastname,
      phonenumber: req.body.phonenumber,
      typeOfTransaction: req.body.typeOfTransaction,
      departmentName: req.body.departmentName,
      date: req.body.date
    });

    // Save the form data to the database
    const savedData = await formData.save();
    return res.status(200).json({ message: "success", data: savedData });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error saving form data");
  }
});

// Define a route to fetch all form data
app.get("/submitdata", async (req, res) => {
  try {
    const formData = await FormModel.find();
    return res.status(200).json(formData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error retrieving form data");
  }
});

// Define a route to fetch data of a specific person by ID
app.get("/submitdata/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const personData = await FormModel.findById(personId);
    return res.status(200).json(personData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error retrieving person data");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
