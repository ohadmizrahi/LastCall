const { Router } = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const User = require('../models/user')
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

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

router.get("/login", (req, res) => {
  res.render("index", {
    body: "partials/bodies/login",
    header: { partial: "partials/headers/header", attr: { auth: false } }
  })
})

router.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

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
        res.cookie('name', user.fName + " " + user.lName);
        return res.redirect("/home");
      });
    })(req, res);
  });
});

router.get("/logout", function (req, res) {
  req.logout(() => {
    res.redirect("/");
  })
});

module.exports = router;