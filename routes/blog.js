const express = require("express");
const mongodb = require("mongodb");

const database = require("../data/database");

const router = express.Router();

router.get("/", function(req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function(req, res) {
  const posts = await database
    .getDb()
    .collection("posts")
    .find({}, {title: 1, summary: 1, "author.name": 1})
    .toArray();
  res.render("posts-list", {posts: posts});
});

router.post("/posts", async function(req, res) {
  const authorId = new mongodb.ObjectId(req.body.author);
  const author = await database.getDb().collection("authors").findOne({_id: authorId});

  await database.getDb().collection("posts").insertOne({
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    date: new Date(),
    author: {
      id: author._id,
      name: author.name,
      email: author.email 
    }
  });

  res.redirect("/posts");
});

router.get("/new-post", async function(req, res) {
  const authors = await database.getDb().collection("authors").find().toArray();
  res.render("new-post", {authors: authors});
});


module.exports = router;