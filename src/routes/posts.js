require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;
const login = require("../middlewares/login")

const postsController = require("../controllers/postsController")

router.get("/", postsController.getAllPosts);

router.get("/:id_post", postsController.getPostSpecifc);

router.post("/", login, postsController.newPost);

router.put("/:id_post", login, postsController.pathPost);

router.delete("/:id_post", login, postsController.deletePost);

module.exports = router;