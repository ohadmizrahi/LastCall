const { Router } = require('express');
const bodyParser = require("body-parser");
const { findReviews, insertNewReview } = require('../models/review/reviewsService')
const { getAllSales } = require('../models/sale/saleService')
const { getAllAirportsByField } = require('../models/airport/airportService')


const router = Router();

router.use(bodyParser.json());

let VALID_DESTINATIONS;

(async () => {
    VALID_DESTINATIONS = await getAllAirportsByField("city");
})();


router.get("/reviews", async (req, res) => {

    if (req.isAuthenticated()) {
        const reviews = await findReviews()
        const salesData = await getAllSales()

        let alertData;
        if (req.session.alertData) {
            alertData = req.session.alertData
        }
        req.session.alertData = null;
        res.render("index",
            {
                body: { main: "partials/reviews/reviewsBody", reviews: reviews, validationData: VALID_DESTINATIONS },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Reviews" },
                sales: { main: "../generalPartials/salesBar", data: salesData },
                alert: { main: "../alert/main", data: alertData, redirectTo: "/reviews" }
            })
    } else {
        res.cookie("returnTo", "/reviews")
        res.redirect("/login");
    }

})
router.post("/add_review", async (req, res) => {
    const status = await insertNewReview(req.body)

    if (status == 0) {
        req.session.alertData = {
            header: "Add Review",
            content: `Done Successfully`
        }
    } else if (status == 1) {
        req.session.alertData = {
            header: "Add Review Failed",
            content: `Review Alredy Exist`
        }
    } else if (status == 2) {
        req.session.alertData = {
            header: "Add Review Failed",
            content: `Invalid Destination`
        }
    } else {
        req.session.alertData = {
            header: "Add Review Failed",
            content: `Error occur when adding, please TRY AGAIN`
        }
    }

    res.json({ success: true });

})


module.exports = router;