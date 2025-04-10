const express = require("express");
const { login, register, logout, getMe } = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

module.exports = router;
