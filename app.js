/////// app.js

require('dotenv').config();
const role_name = process.env.role_name;
const role_password = process.env.role_password;

const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// id column should look like "id SERIAL PRIMARY KEY,"
const pool = new Pool({
  connectionString: "postgresql://" + role_name + ":" + role_password + "@localhost:5432/basics"
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/sign-up", (req, res) => res.render("sign-up-form"));

app.get("/", async function(req, res) {
  const items = await fetchItems();
  res.render("index", { user: req.user, items: items});
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/sign-up", async (req, res, next) => {
 try {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await pool.query("insert into users (username, password, member) values ($1, $2, $3)", [req.body.username, hashedPassword, false]);
  res.redirect("/");
 } catch (error) {
    console.error(error);
    next(error);
   }
});


app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

// get items for index
async function fetchItems(){
  try{
    const { rows } = await pool.query("SELECT * FROM items");
    const items = rows;
    if(items) {
      return items;
    } else {
      console.log('Item not found');
    }
  } catch(error) {
    console.error('Error, cannot find items.');
  }
}

// 3 functions below are important to create and maintain sessions
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});



app.listen(3000, () => console.log("app listening on port 3000!"));
