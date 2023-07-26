const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: "partials/bodies/home",
                header: {partial: "partials/headers/header", attr: {auth: true}}
            })
    } else {
        res.redirect("/login");
    }

})

module.exports = router;