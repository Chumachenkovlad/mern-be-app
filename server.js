const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todosRouter = express.Router();
const PORT = 4000;
const _ = require("lodash");

let Todo = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017", {
  dbName: "todos",
  user: "root",
  pass: "example",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;

todosRouter.route("/").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todosRouter.get("/:id").get((req, res) => {
  const id = req.params.id;

  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

todosRouter.route("/add").post(async (req, res) => {
  try {
    let todo = await Todo.create(req.body);
    todo = await todo.save();
    res.status(200).json(todo);
  } catch (e) {
    res.status(400).send("adding new todo failed");
  }
});

todosRouter.route("/update/:id").post((req, res) => {
  const id = req.params.id;

  Todo.findById(id, async (err, todo) => {
    _.assignIn(todo, req.body);

    try {
      let item = await todo.save();
      res.status(200).json(item);
    } catch (e) {
      res.status(400).send("updating new todo failed");
    }
  });
});

todosRouter.route("/remove/:id").delete((req, res) => {
  const id = req.params.id;

  Todo.findById(id, async (err, todo) => {
    try {
      let item = await todo.remove();
      res.status(200).json(item);
    } catch (e) {
      res.status(400).send("updating new todo failed");
    }
  });
});

app.use("/todos", todosRouter);

connection.once("open", () =>
  console.log(`MongoDB database connection established successfully`)
);
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
