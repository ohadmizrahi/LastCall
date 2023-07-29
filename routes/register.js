const { Router } = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const User = require('../models/user')

const router = Router();

router.use(bodyParser.urlencoded({
  extended: true
}));

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.get("/register", function (req, res) {
  res.render("index", {
    body: {main: "partials/bodies/register"},
    header: {main: "partials/headers/header", auth: "authDiv/afterAuth"}
  })
});

router.post("/register", function (req, res) {
  const password = req.body.password;
  const passwordAuthentication = req.body.passwordAuthentication;
  const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

  if (password !== passwordAuthentication || !passwordRegex.test(password)) {
    console.log("The password does not meet the complexity requirements.");
    return res.redirect("/register");
  }

  User.register({ username: req.body.email, fName: req.body.fname, lName: req.body.lname }, password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect("/register");
    } else {
      return res.redirect("/login")
    }
  });
});

module.exports = router;
