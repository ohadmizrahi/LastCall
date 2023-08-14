const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const { getValidDestinations } = require('../models/reviews')

const router = Router();


router.use(bodyParser.urlencoded({ extended: true }));

router.get("/admin", async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        res.render("index",
        {
            body: {main: "partials/admin/admin"},
            header: {main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Admin"}
        })
      } else {
        res.redirect("/home");
    }

})

router.post("/admin/add_sale", async (req, res) => {
    console.log(req.body);
})

router.get("/admin/add_sale", async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        const validDestinations = await getValidDestinations()
        res.render("index",
        {
            body: {main: "partials/admin/newSale", validDestinations: validDestinations},
            header: {main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Admin"}
        })
      } else {
        res.redirect("/home");
    }

})

router.get("/admin/new_flights", async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        res.render("index",
        {
            body: {main: "partials/admin/newFlight"},
            header: {main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Admin"}
        })
      } else {
        res.redirect("/home");
    }

})

module.exports = router;