const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/dest", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: {main: "partials/bodies/dest"},
                header: {main: "partials/headers/header", auth: "authDiv/afterAuth"}
            })
    } else {
        res.cookie("returnTo", "/dest")
        console.log(req.session.returnTo);
        res.redirect("/login");
    }

})

router.get("/flights", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: {main:"partials/bodies/flights"},
                header: {main: "partials/headers/header", auth: "authDiv/afterAuth"}
            })
    } else {
        res.cookie("returnTo", "/flights")
        res.redirect("/login");
    }

})

router.get("/reviews", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: {main: "partials/bodies/reviews"},
                header: {main: "partials/headers/header", auth: "authDiv/afterAuth"}
            })
    } else {
        res.cookie("returnTo", "/reviews")
        res.redirect("/login");
    }

})

module.exports = router;