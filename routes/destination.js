const { Router } = require('express');
const bodyParser = require("body-parser");
const { findReviews} = require('../models/review/reviewsService')
const { getAllSales } = require('../models/sale/saleService')
const { getPopularDestinations, updateDestinationsPopularity, generateTourismData, getRecomandationFromGPT } = require('../models/destination/destinationService')
const { getAllAirportsByField } = require('../models/airport/airportService')

const router = Router();

router.use(bodyParser.json());

let VALID_DESTINATIONS;

(async () => {
    VALID_DESTINATIONS = await getAllAirportsByField("city");
})();


router.get("/dest", async (req, res) => {
    if (req.isAuthenticated()) {
        const salesData = await getAllSales()
        const destinations = await getPopularDestinations()

        let alertData;
        if (req.session.alertData) {
            alertData = req.session.alertData
        }
        req.session.alertData = null

        res.render("index",
            {
                body: { main: "partials/destinations/destinationBody", destinations: destinations },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Destinations" },
                sales: { main: "../generalPartials/salesBar", data: salesData },
                alert: { main: "../alert/main", data: alertData, redirectTo: "/dest" }
            })
    } else {
        res.cookie("returnTo", "/dest")
        res.redirect("/login");
    }

})

router.get("/dest/:name", async (req, res) => {

    if (req.isAuthenticated()) {
        const salesData = await getAllSales()
        const destination = req.session.destination;
        const reviews = await findReviews();

        let alertData;
        if (req.session.alertData) {
            alertData = req.session.alertData
        }

        res.render("index",
            {
                body: { main: "partials/destinations/destinationPage", destination: destination, reviews: reviews, validationData: VALID_DESTINATIONS },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Destinations" },
                sales: { main: "../generalPartials/salesBar", data: salesData },
                alert: { main: "../alert/main", data: alertData, redirectTo: "/dest" }
            })
    } else {
        res.cookie("returnTo", "/dest")
        res.redirect("/login");
    }
})

router.post("/dest/:name", async (req, res) => {
    const destination = req.body;

    const updatedDestination = await updateDestinationsPopularity(destination)
    req.session.destination = updatedDestination;

    res.redirect(`/dest/${updatedDestination.name}`);
});

router.get("/generate_chart_data", async (req, res) => {
    const destination = req.session.destination;
    const tourismData = await generateTourismData(destination)
    res.json(tourismData);
})

router.post("/get_recomandation", async (req, res) => {
    const data = req.body;
    getRecomandationFromGPT(data)
        .then(response => {
            if (response.status == 0) {
                const messageList = [response.recomandation]
                res.cookie("gptRecommendation", response.recomandation)
                res.json(messageList);
            } else {
                throw Error
            }
        })
        .catch(error => {
            console.error("Error getting recommendation:", error);
            req.session.alertData = {
                header: "Error Getting Recomandation",
                content: `Please Try Again`
            }
                res.status(500).json({
        success: false,
        message: "Error getting recommendation. Please try again later."
    });
            
        });
});


module.exports = router;