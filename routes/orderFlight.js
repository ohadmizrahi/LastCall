const { Router } = require('express');
const router = Router();

router.get("/order", (req, res) => {
    res.render("index",
    {
    body: { main: "partials/flights/orderFlight" },
    header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Order" }
    });
});

module.exports = router;