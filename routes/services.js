const { Router } = require('express');
const bodyParser = require("body-parser");
const { findReviews, insertNewReview } = require('../models/review/reviewsService')
const { getAllSales } = require('../models/sale/saleService')
const { getPopularDestinations, updateDestinationsPopularity, generateTourismData, getRecomandationFromGPT } = require('../models/destination/destinationService')
const { buildFindQuery, findFlights } = require('../models/flight/flightService')
const { findCityByCountry, getAllAirportsByField } = require('../models/airport/airportService')

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

        res.render("index",
            {
                body: { main: "partials/destinations/destinationPage", destination: destination, reviews: reviews, validationData: VALID_DESTINATIONS },
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
        let alertData;

        if (req.session.alertData) {
            alertData = req.session.alertData
        }

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
        req.session.alertData = null;

        res.render("index",
            {
                body: { main: "partials/flights/flightsBody", flights: flights, defaultDep: userCity, validationData: VALID_DESTINATIONS },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Flights" },
                sales: { main: "../generalPartials/salesBar", data: salesData },
                alert: { main: "../alert/main", data: alertData, redirectTo: "/flights" }
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
            returnDate: returnDate,
            travelers: travelers
        } = req.body

        const limit = 5
        const query = buildFindQuery(departure, travelers, departureDate, destination)
        const flights = await findFlights(limit, query, returnDate)

        if (flights.length < 1) {
            req.session.alertData = {
                header: "Can't Find Flights",
                content: `We're here to help! Adjust your search parameters or check back later as we constantly update our flight listings.`
            }
        }

        req.session.searchFlights = flights;
        await updateDestinationsPopularity({ name: destination })
        res.redirect("/flights")
    }
    catch (error) {
        console.error('Error:', error);
        req.session.alertData = {
            header: "Error Finding Flights",
            content: `Please Try Again`
        }
        res.redirect("/flights")
    }
})


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