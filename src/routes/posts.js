require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;

const loginObrigatorio = require("../middlewares/login")
const postsController = require("../controllers/postsController")

router.get("/", postsController.pegarTodosPosts);

router.get("/:id_post", postsController.pegarPostEspecifico);

router.post("/", loginObrigatorio, postsController.criarPost);

router.put("/:id_post", loginObrigatorio, postsController.alterarPost);

router.delete("/:id_post", loginObrigatorio, postsController.excluirPost);

module.exports = router;