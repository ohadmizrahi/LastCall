const { Router } = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const { findOrCreateUser, newStrategy, findUserByID } = require("../models/user/userService")
const session = require('express-session');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(session({
  secret: 'ohad mizrahi',
  resave: false,
  saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(newStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findUserByID(id, done)
});

router.get("/login", (req, res) => {
  res.render("index", {
    body: {main: "partials/generalBodies/login"},
    header: {main: "partials/headers/main", auth: "authDiv/beforeAuth", pageTitle: "Login"}
  })
})

router.post("/login", function (req, res) {

  const user = findOrCreateUser(req.body.username, req.body.password)

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      return res.redirect("/login");
    }
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        console.log(err);
        return res.redirect("/login");
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          return res.redirect("/login");
        }
        res.cookie('name', (user.fName + " " + user.lName).toLowerCase().replace(/(?:^|\s)\w/g, function(match) {return match.toUpperCase();}));
        res.cookie('userEmail', user.email)
        res.cookie('userCountry', user.country.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {return match.toUpperCase();}));
        res.cookie('authLevel', user.authLevel)
        const returnTo = req.cookies.returnTo || "/home"
        res.clearCookie('returnTo');
        return res.redirect(returnTo);
      });
    })(req, res);
  });
});

router.get("/logout", function (req, res) {
  req.logout(() => {
    res.clearCookie('name');
    res.clearCookie('userCountry');
    res.clearCookie('authLevel');
    res.redirect("/");
  })
});

module.exports = router;