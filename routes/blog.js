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
    date: new Date().toISOString(),
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

router.get("/posts/:id", async function(req, res) {
  const postId = req.params.id;
  const post = await database
    .getDb()
    .collection("posts")
    .findOne({_id: mongodb.ObjectId(postId)}, {summary: 0});
  
  if (!post) {
    res.status(404).render("404");
    return;
  }

  res.render("post-detail", {post: post, comments: null})
});

// Ajax
router.get("posts/:id/comments", async function(req, res) {
  const postId = new mongodb.ObjectId(req.params.id);
  const comments = await database.getDb().collection("comments").find({postId: postId}).toArray();

  res.json(comments);
});

// Ajax
router.post("/posts/:id/comments", async function(req, res) {
  const postId = new mongodb.ObjectId(req.params.id);
  await database.getDb().collection('comments').insertOne({
    postId: postId,
    title: req.body.title,
    content: req.body.content
  });

  res.json({message: '댓글이 추가됐습니다.'});
});

router.get("/posts/:id/edit", async function(req, res) {
  const postId = req.params.id;
  const post = await db
    .getDb()
    .collection('posts')
    .findOne({ _id: new mongodb.ObjectId(postId) }, { title: 1, summary: 1, body: 1 });
  
    if (!post) {
      res.status(404).render("404");
      return;
    }

    res.render("update-post", {post: post});
});

router.post("/posts/:id/edit", async function(req, res) {
  const postId = req.params.id;
  await database.getDb().collection("posts").updateOne(
    { _id: new mongodb.ObjectId(postId) },
    {
      $set: {
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content
      }
    }
  );

  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function(req, res) {
  const postId = req.params.id;
  await database.getDb().collection("posts").deleteOne({_id: new mongodb.ObjectId(postId)});
  
  res.redirect("/posts");
})

module.exports = router;