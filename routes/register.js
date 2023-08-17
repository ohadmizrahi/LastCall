const { Router } = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const { insertNewUser, newStrategy, findUserByID } = require("../models/user/userService")

const router = Router();

router.use(bodyParser.urlencoded({
  extended: true
}));

passport.use(newStrategy);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findUserByID(id, done)
});

router.get("/register", function (req, res) {
  res.render("index", {
    body: { main: "partials/generalBodies/register" },
    header: { main: "partials/headers/main", auth: "authDiv/beforeAuth", pageTitle: "Register" }
  })
});

router.post("/register", function (req, res) {
  const password = req.body.password;
  const passwordAuthentication = req.body.passwordauth;
  const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

  if (password !== passwordAuthentication || !passwordRegex.test(password)) {
    console.log("The password does not meet the complexity requirements.");
    return res.redirect("/register");
  }
  const success = insertNewUser(req.body.username, req.body.fname, req.body.lname, req.body.email, req.body.country, password)
  if (success) {
    res.redirect("/login")
  } else {
    res.redirect("/register");
  }


});


module.exports = router;
