const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 4000;

// MONGO CONNECTION
mongoose
  .connect("mongodb://localhost:27017/HACKATHON")
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

// FOR FRONTEND
const app = express();
app.use(express.json());
app.use(cors())

const SCHEMA = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
);
const MODEL = new mongoose.model("users", SCHEMA);

// EMAIL AND PASSWORD VERIFICATION START
app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await MODEL.findOne({ email: email, password: password });

    if (user) {
      // Both email and password are correct
      res.json("exist");
    } else {
      // Either email or password is incorrect
      res.json("notexist");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const data = {
    email: email,
    password: password,
  };

  try {
    const check = await MODEL.findOne({ email: email });

    if (check) {
      res.json("exist");
    } else {
      res.json("notexist");
      await MODEL.insertMany([data]);
    }
  } catch (error) {
    console.log(error);
  }
});
// EMAIL AND PASSWORD VERIFICATION COMPLETE

// Define a route for handling GET requests to /collections
app.get("/collections", async (req, res) => {
  try {
    const data = await MODEL.find();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get a student by ID
app.get("/project/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await MODEL.findById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

// Define a schema for the projects
const projectSchema = new mongoose.Schema({
  title: String,
  name: String,
  description: String,
  hostedUrl: String,
});

const Project = mongoose.model('Project', projectSchema);


// Endpoint to add a new project
app.post('/projects', async (req, res) => {
  try {
    const { title, name, description, hostedUrl } = req.body;

    // Create a new project instance
    const newProject = new Project({
      title,
      name,
      description,
      hostedUrl,
    });

    // Save the project to the database
    await newProject.save();

    res.status(201).json({ message: 'Project added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a new endpoint to retrieve all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});
