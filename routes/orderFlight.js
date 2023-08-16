const { Router } = require('express');
const router = Router();

router.get("/order", (req, res) => {
    if (req.isAuthenticated()) {
    res.render("index",
    {
    body: { main: "partials/flights/orderFlight", flights: JSON.parse(req.query.flightData) },
    header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Order" }
    })
    }else {
    res.redirect("/login")
    };

});

module.exports = router;