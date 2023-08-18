const { Router } = require('express');
const bodyParser = require("body-parser");
const { findReviews, insertNewReview } = require('../models/review/reviewsService')
const { getAllSales } = require('../models/sale/saleService')
const { getPopularDestinations, updateDestinationsPopularity, generateTourismData, getRecomandationFromGPT } = require('../models/destination/destinationService')
const { buildFindQuery, findFlights } = require('../models/flight/flightService')
const { findCityByCountry, getAllDestinations } = require('../models/airport/airportService')

const router = Router();

router.use(bodyParser.json());

router.get("/dest", async (req, res) => {
    if (req.isAuthenticated()) {
        const salesData = await getAllSales()
        const destinations = await getPopularDestinations()

        res.render("index",
            {
                body: { main: "partials/destinations/destinationBody", destinations: destinations },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Destinations" },
                sales: { main: "../generalPartials/salesBar", data: salesData }
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
        const validDestinations = await getAllDestinations()
        console.log("loading");

        res.render("index",
            {
                body: { main: "partials/destinations/destinationPage", destination: destination, reviews: reviews, validDestinations: validDestinations },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Destinations" },
                sales: { main: "../generalPartials/salesBar", data: salesData }
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
        .then(recomandation => {
            const messageList = [recomandation]
            res.cookie("gptRecommendation", recomandation)
            res.json(messageList);
        })
        .catch(error => {
            console.error("Error getting recommendation:", error);
            res.status(500).json({ error: "Error getting recommendation" });
        });
});


router.get("/flights", async (req, res) => {
    if (req.isAuthenticated()) {
        const salesData = await getAllSales()
        const userCountry = req.cookies.userCountry;
        const userCity = await findCityByCountry(userCountry)

        let flights;

        if (req.session.searchFlights) {
            flights = req.session.searchFlights
        } else {
            const limit = 5
            flights = await findFlights(limit)
        }
        if (flights.length < 1) {
            flights = null
        }
        req.session.searchFlights = null

        res.render("index",
            {
                body: { main: "partials/flights/flightsBody", flights: flights, defaultDep: userCity },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Flights" },
                sales: { main: "../generalPartials/salesBar", data: salesData }
            })

    } else {
        res.cookie("returnTo", "/flights")
        res.redirect("/login");
    }

})


router.post("/search_flights", async (req, res) => {
    try {
        const {
            departure: departure,
            destination: destination,
            departureDate: departureDate,
            arrivelDate: arrivelDate,
            travelers: travelers
        } = req.body.searchFields



        const limit = 5
        const query = buildFindQuery(departure, travelers, departureDate, destination)
        const flights = await findFlights(limit, query)
        req.session.searchFlights = flights;
        await updateDestinationsPopularity({ name: destination })
        res.send({ success: true })
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Failed to search flights." });
    }
})


router.get("/reviews", async (req, res) => {

    if (req.isAuthenticated()) {
        const reviews = await findReviews()
        const validDestinations = await getAllDestinations()
        const salesData = await getAllSales()
        res.render("index",
            {
                body: { main: "partials/reviews/reviewsBody", reviews: reviews, validDestinations: validDestinations },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Reviews" },
                sales: { main: "../generalPartials/salesBar", data: salesData }
            })
    } else {
        res.cookie("returnTo", "/reviews")
        res.redirect("/login");
    }

})
router.post("/add_review", async (req, res) => {
    await insertNewReview(req.body)
    res.json({ success: true });

})


module.exports = router;