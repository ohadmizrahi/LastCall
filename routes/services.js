const { Router } = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const { getReviews, addReview } = require('../models/reviews')
const { getSales } = require('../models/sale')
const { getPopularDestinations, updateDestinations, generateTourismData, getRecomandationFromGPT } = require('../models/destinations')
const { insertNewFlights, buildFindQuery, findFlights } = require('../models/flights')
const { insertNewAirports } = require('../models/airports')
const { generateFlights } = require('../models/flightsGenerator')

const router = Router();

router.use(bodyParser.json());

router.get("/dest", (req, res) => {
    if (req.isAuthenticated()) {
        const data = getSales()
        const destinations = getPopularDestinations()

        res.render("index",
            {
                body: { main: "partials/bodies/destination", destinations: destinations },
                header: { main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Destinations" },
                sales: { main: "../salesBar", data: data }
            })
    } else {
        res.cookie("returnTo", "/dest")
        console.log(req.session.returnTo);
        res.redirect("/login");
    }

})

router.get("/dest/:name", async (req, res) => {
    const data = getSales()
    const destination = req.session.destination;
    const reviews = getReviews();

    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: { main: "partials/destinationPage", destination: destination , reviews: reviews},
                header: { main: "partials/headers/header", auth: "authDiv/afterAuth", pageTitle: "Destinations" },
                sales: { main: "../salesBar", data: data }
            })
    } else {
        res.cookie("returnTo", "/dest")
        console.log(req.session.returnTo);
        res.redirect("/login");
    }
})

router.get("/generate_chart_data", async (req, res) => {
    const destination = req.session.destination;
    const tourismData = await generateTourismData(destination)
    res.json(tourismData);
})

router.post("/dest/get_recomandation", async (req, res) => {
    const data = req.body;
    getRecomandationFromGPT(data)
        .then(recomandation => {
            const messageList = [recomandation]
            res.cookie("gptRecommendation", recomandation)
            res.json(messageList);
        })
    // .catch(error => {
    //     console.error("Error getting recommendation:", error);
    //     res.status(500).json({ error: "Error getting recommendation" });
    // });
});

router.post("/dest/:name", async (req, res) => {
    const destination = req.body;

    if (!destination.avgRank) {
        destination.avgRank = Number((Math.random() * (10 - 5) + 5).toFixed(1))
    }
    destination.img = await updateDestinations(destination)
    req.session.destination = destination;

    res.redirect(`/dest/${destination.name}`);
});

router.get("/flights", async (req, res) => {
    if (req.isAuthenticated()) {
        const data = getSales()

        const allFlights = await findFlights()
        res.render("index",
            {
                body: { main: "partials/bodies/flights", flights: allFlights },
                header: { main: "partials/headers/header", auth: "authDiv/afterAuth" , pageTitle: "Flights" },
                sales: { main: "../salesBar", data: data }
            })
    } else {
        res.cookie("returnTo", "/flights")
        res.redirect("/login");
    }

})

router.get("/generate_new_flights", async (req, res) => {
    try {
        console.log("Start Generating new flights")
        const flightsData = await generateFlights(50)
        if (flightsData) {
            console.log("Finished Generating new flights")
            console.log("Start inserting new flights to DB");
            const flights = await insertNewFlights(flightsData)
            if (flights) {
                console.log("Finished inserting new flights to DB");
                res.status(200).json({ message: "Flights inserted successfully." });
            } else {
                res.status(500).json({ error: "Failed to insert flights." });
            }
        } else {
            res.status(500).json({ error: "Failed to fetch flights data." });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Failed to fetch flights data." });
    }

})


router.get("/reviews", (req, res) => {
    const reviews = getReviews()
    if (req.isAuthenticated()) {
        const data = getSales()
        res.render("index",
            {
                body: { main: "partials/bodies/reviews", reviews: reviews },
                header: { main: "partials/headers/header", auth: "authDiv/afterAuth" , pageTitle: "Reviews" },
                sales: { main: "../salesBar", data: data }
            })
    } else {
        res.cookie("returnTo", "/reviews")
        res.redirect("/login");
    }

})
router.post("/add_review", (req, res) => {
    addReview(req.body)
    res.json({ success: true });

})

module.exports = router;