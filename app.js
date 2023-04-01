const path = require("path");
const express = require("express");

const database = require("./data/database");
const blogRoutes = require("./routes/blog");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.json()); // json 파일(Ajax) 디코딩
app.use(express.static("public"));

app.use(blogRoutes);

app.use(function(error, req, res, next) {
  res.status(500).render("500");
})

database.connectToDatabase().then(function() {
  app.listen(3000);
})