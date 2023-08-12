const { Router } = require('express');
const router = Router();

router.get("/order_flight", (req, res) => {
    res.render("index",
    {
    body: { main: "partials/orderFlight" },
    header: { main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Order" }
    });
});

module.exports = router;