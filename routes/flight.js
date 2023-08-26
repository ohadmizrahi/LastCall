const { Router } = require('express');
const bodyParser = require("body-parser");
const { getAllSales } = require('../models/sale/saleService')
const { updateDestinationsPopularity } = require('../models/destination/destinationService')
const { buildFindQuery, findFlights } = require('../models/flight/flightService')
const { findCityByCountry, getAllAirportsByField } = require('../models/airport/airportService')
const { sendEmail, buildEmailData, buildEmailContent } = require("../services/email")


const router = Router();

router.use(bodyParser.json());

let VALID_DESTINATIONS;

(async () => {
    VALID_DESTINATIONS = await getAllAirportsByField("city");
})();


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
        let {
            departure: departure,
            destination: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            travelers: travelers
        } = req.body


        const limit = 5
        let noRange = true

        const query = buildFindQuery(destination, departureDate, departure, noRange)
        const flights = await findFlights(limit, query, returnDate)

        if (flights.length < 1) {
            req.session.alertData = {
                header: "Can't Find Flights",
                content: `We're here to help! Adjust your search parameters or check back later as we constantly update our flight listings.`
            }
        }

        req.session.searchFlights = flights;
        await updateDestinationsPopularity({ name: destination })

        if (!req.body.manual) {
            res.redirect("/flights")
        } else {
            res.json({ success: true })
        }
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

router.get("/order", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("index",
            {
                body: { main: "partials/flights/orderFlight", flights: req.session.flightData },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Order" }
            });
    } else {
        res.redirect("/login");
    }
});

router.post("/setFlightData", (req, res) => {
    if (req.isAuthenticated()) {
        req.session.flightData = req.body.flightData;
        res.redirect("/order");
    } else {
        res.redirect("/login");
    }
});


router.post("/order", async (req, res) => {
    try {
        const { flightsData: flightsData, usersData: usersData } = req.body
        const subject = "Flight Order Confirmation - LastCall"
        Object.keys(usersData).forEach((user) => {
            const content = buildEmailContent(usersData[user], flightsData)
            const emailData = buildEmailData(usersData[user].email, subject, content)
            sendEmail(emailData)

        })
        req.session.alertData = {
            header: "Congratulations !",
            content: `Your payment has been confirmed and Email sent with the flight details.`
        }
        res.json({
            success: true
        })
    }
    catch (error) {
        console.error('Error:', error);
        req.session.alertData = {
            header: "Error Order Flight",
            content: `Please Try Again`
        }
        res.json({
            success: false
        })
    }
})

module.exports = router;