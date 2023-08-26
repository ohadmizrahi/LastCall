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
  let alertData;
  if (req.session.alertData) {
      alertData = req.session.alertData
  }
  req.session.alertData = null;
  res.render("index", {
    body: { main: "partials/generalBodies/register" },
    header: { main: "partials/headers/main", auth: "authDiv/beforeAuth", pageTitle: "Register" },
    alert: { main: "../alert/main", data: alertData, redirectTo: "/register" }
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
  insertNewUser(req.body.username, req.body.fname, req.body.lname, req.body.email, req.body.country, password)
  .then(success => {
    console.log('User successfully inserted:', user);
    res.redirect("/login")
  })
  .catch(error => {
    console.log('Error inserting user:', error);
    req.session.alertData = {
      header: "Register Failed",
      content: `Error occur during registeration, please TRY AGAIN`
  }
  res.redirect("/register");
  });
});


module.exports = router;
