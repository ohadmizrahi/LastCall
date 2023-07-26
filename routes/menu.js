const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/dest", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: "partials/bodies/dest",
                header: {partial: "partials/headers/header", attr: {auth: true}}
            })
    } else {
        res.redirect("/login");
    }

})

router.get("/flights", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: "partials/bodies/flights",
                header: {partial: "partials/headers/header", attr: {auth: true}}
            })
    } else {
        res.redirect("/login");
    }

})

router.get("/reviews", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: "partials/bodies/reviews",
                header: {partial: "partials/headers/header", attr: {auth: true}}
            })
    } else {
        res.redirect("/login");
    }

})

module.exports = router;