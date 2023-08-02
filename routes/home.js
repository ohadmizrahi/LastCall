const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const { getSales } = require('../models/sale')
const router = Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        const data = getSales()
        res.render("index",
            {
                body: {main: "partials/bodies/home"},
                header: {main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Home"},
                sales: {main:"../salesBar",data:  data}
            })
    } else {
        res.redirect("/login");
    }

})

module.exports = router;