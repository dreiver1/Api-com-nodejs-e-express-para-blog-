require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;

const loginObrigatorio = require("../middlewares/loginObrigatorio")
const postsController = require("../controllers/postsController")

router.get("/", postsController.getAllPosts);

router.get("/:id_post", postsController.getPostSpecifc);

router.post("/", loginObrigatorio, postsController.newPost);

router.put("/:id_post", loginObrigatorio, postsController.pathPost);

router.delete("/:id_post", loginObrigatorio, postsController.deletePost);

module.exports = router;