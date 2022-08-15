require('dotenv').config();
const express = require('express');
const router = express.Router();
const connection = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userControllers = require('../controllers/usersController');

router.post("/cadastro", userControllers.createNewUser)

router.post("/login", userControllers.login)

module.exports = router;