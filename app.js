const path = require("path");
const express = require("express");

const database = require("./data/database");
const blogRoutes = require("./routes/blog");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

app.use(blogRoutes);

database.connectToDatabase().then(function() {
  app.listen(3000);
})