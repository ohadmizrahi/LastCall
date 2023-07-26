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
    body: "partials/bodies/register",
    header: {partial: "partials/headers/header", attr: {auth: false}}
  })
});

router.post("/register", function (req, res) {

  User.register({ username: req.body.email, fName: req.body.fname, lName: req.body.lname }, req.body.password, function (err, user) {
    console.log(req.body);
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      res.redirect("/login")
    }
  });

});

module.exports = router;