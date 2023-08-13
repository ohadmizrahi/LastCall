const { Router } = require('express');
const router = Router();

router.post("/submit_order", (req, res) => {
    res.render("index",
    {
    body: { main: "partials/confirmOrder" },
    header: { main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Confirmation" }
    });
});



module.exports = router;