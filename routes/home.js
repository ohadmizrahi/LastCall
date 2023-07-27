const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: {main: "partials/bodies/home"},
                header: {main: "partials/headers/header", auth: "authDiv/afterAuth"}
            })
    } else {
        res.redirect("/login");
    }

})

module.exports = router;