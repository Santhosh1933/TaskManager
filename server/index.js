const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
// My Routes
const Users = require("./Models/Users");
const Tasks = require("./Models/Tasks");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
mongoose.connect("mongodb://localhost/To-Do");

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await Users.create({
      name,
      email,
      password,
    });
    await data.save();
    await res.send(data).status(200);
  } catch (error) {
    res.send(error).status(501);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await Users.find({ email: email, password: password });
    await res.send(data).status(200);
  } catch (error) {
    res.send(error).status(501);
  }
});

// Add Task
app.post("/Tasks", async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      subTasks,
      status,
      deadLine,
      priority,
      assignees,
      comments,
    } = req.body;
    const data = await Tasks.create({
      userId,
      title,
      description,
      subTasks,
      status,
      deadLine,
      priority,
      assignees,
      comments,
    });
    await data.save();
    await res.send(data).status(200);
  } catch (error) {
    res.send(error).status(501);
  }
});

app.get("/Tasks", async (req, res) => {
  try {
    const userId = req.query;
    const data = await Tasks.find({ userId: userId });
    await res.send(data).status(200);
  } catch (error) {
    res.send(error).status(501);
  }
});
