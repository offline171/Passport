const {Router} = require("express");
const signUpRouter = Router();
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

signUpRouter.get("/", (req, res) => {
    res.render("sign-up-form")
});

signUpRouter.post("/", async (req, res, next) => {
 try {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await pool.query("insert into users (username, password, member) values ($1, $2, $3)", [req.body.username, hashedPassword, false]);
  res.redirect("/");
 } catch (error) {
    console.error(error);
    next(error);
   }
});

module.exports = signUpRouter;