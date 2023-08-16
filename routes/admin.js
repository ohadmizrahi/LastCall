const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const { getValidDestinations } = require('../models/reviews')
const { insertSale } = require('../models/sale')

const router = Router();


router.use(bodyParser.urlencoded({ extended: true }));

router.get("/admin", async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        res.render("index",
            {
                body: { main: "partials/admin/admin" },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})

router.get("/is_admin", async (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAdmin: req.cookies.isAdmin });
    } else {
        res.redirect("/login");
    }
})

router.post("/admin/add_sale", async (req, res) => {
    await insertSale(req.body)
})

router.get("/admin/add_sale", async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        const validDestinations = await getValidDestinations()
        res.render("index",
            {
                body: { main: "partials/admin/newSale", validDestinations: validDestinations },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})

router.get("/admin/new_flights", async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        res.render("index",
            {
                body: { main: "partials/admin/newFlight" },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})

module.exports = router;