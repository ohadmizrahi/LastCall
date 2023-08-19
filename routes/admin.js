const { Router } = require('express');
const bodyParser = require("body-parser");
const { insertSale, deleteSale } = require('../models/sale/saleService')
const { generateFlights } = require('../models/flight/flightsGenerator')
const { insertNewFlights } = require('../models/flight/flightService')
const { getAllAirportsByField } = require('../models/airport/airportService')
const { deleteUser, updateUser } = require('../models/user/userService')

const router = Router();

let VALID_DESTINATIONS;
let VALID_AIRPORTS_CODES;

(async () => {
    VALID_DESTINATIONS = await getAllAirportsByField("city");
})();

(async () => {
    VALID_AIRPORTS_CODES = await getAllAirportsByField("code");
})();


router.use(bodyParser.urlencoded({ extended: true }));

router.get("/admin", async (req, res) => {
    if (req.isAuthenticated() && req.user.authLevel == "admin") {
        let alertData;
        if (req.session.alertData) {
            alertData = req.session.alertData
        }
        req.session.alertData = null;
        res.render("index",
            {
                body: { main: "partials/admin/admin" },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" },
                alert: { main: "../alert/main", data: alertData, redirectTo: "/admin" }
            })
    } else {
        res.redirect("/home");
    }

})

router.get("/is_admin", async (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authLevel: req.cookies.authLevel });
    } else {
        res.redirect("/login");
    }
})


router.get("/admin/sale", async (req, res) => {
    if (req.isAuthenticated() && req.user.authLevel == "admin") {

        res.render("index",
            {
                body: { main: "partials/admin/adminSale" },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})

router.get("/admin/flights", async (req, res) => {
    if (req.isAuthenticated() && req.user.authLevel == "admin") {

        res.render("index",
            {
                body: { main: "partials/admin/adminFlight" },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})

router.get("/admin/auth", async (req, res) => {
    if (req.isAuthenticated() && req.user.authLevel == "admin") {

        res.render("index",
            {
                body: { main: "partials/admin/adminAuth" },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})


router.get("/admin/add_sale", async (req, res) => {
    if (req.isAuthenticated() && req.user.authLevel == "admin") {
        res.render("index",
            {
                body: { main: "partials/admin/newSale", validationData: VALID_DESTINATIONS },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})

router.post("/admin/add_sale", async (req, res) => {
    const status = await insertSale(req.body)
    if (status == 0) {
        req.session.alertData = {
            header: "Add Sale",
            content: `Done Successfully`
        }
    } else if (status == 1) {
        req.session.alertData = {
            header: "Add Sale",
            content: `Sale Already Exist`
        }
    } else {
        req.session.alertData = {
            header: "Add Sale Failed",
            content: `Error occur when adding sale, please TRY AGAIN`
        }
    }
    res.redirect("/admin")
})

router.get("/admin/delete_sale", async (req, res) => {
    if (req.isAuthenticated() && req.user.authLevel == "admin") {
        res.render("index",
            {
                body: { main: "partials/admin/deleteSale", validationData: VALID_DESTINATIONS },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }

})

router.post("/admin/delete_sale", async (req, res) => {
    console.log(req.body);
    const status = await deleteSale(req.body)
    if (status == 0) {
        req.session.alertData = {
            header: "Delete Sale",
            content: `Done Successfully`
        }
    } else if (status == 1) {
        req.session.alertData = {
            header: "Delete Sale Failed",
            content: `Sale Not Found`
        }
    } else {
        req.session.alertData = {
            header: "Delete Sale Failed",
            content: `Error occur when deleting, please TRY AGAIN`
        }
    }
    res.redirect("/admin")
})

router.get("/admin/generate_new_flights", async (req, res) => {
    try {
        const flightsData = await generateFlights(1)
        if (flightsData) {

            const flights = await insertNewFlights(flightsData)
            if (flights) {
                req.session.alertData = {
                    header: "Fetching Flights Done Successfully",
                    content: `${flights.length} flights fetched`
                }

                res.status(200).json({ flightsCount: flightsData.length });
            } else {
                throw new Error("Failed to insert flights.");
            }
        } else {
            throw new Error("Failed to insert flights.");
        }
    } catch (error) {
        req.session.alertData = {
            header: "Fetching Flights Failed",
            content: `Error occured, please try again`
        }
        console.error('Error:', error);
        res.status(500).json({ error: "Failed to fetch flights data." });
    }

})

router.get("/admin/add_flight", async (req, res) => {
    if (req.isAuthenticated() && req.user.authLevel == "admin") {

        res.render("index",
            {
                body: { main: "partials/admin/addFlightManualy", validationData: VALID_AIRPORTS_CODES },
                header: { main: "partials/headers/main", auth: "authDiv/afterAuth", pageTitle: "Admin" }
            })
    } else {
        res.redirect("/home");
    }
})

router.post("/admin/add_flight", async (req, res) => {
    try {
        let manualFlight = req.body
        if (!(manualFlight.goDepAirportCode || manualFlight.goArrAirportCode)) {
            req.session.alertData = {
                header: "Add Flight Failed",
                content: "Invalid Airports IATA Code"
            }
        } else {

            manualFlight.goDepDateTime = new Date(manualFlight.goDepDateTime).toISOString()
            if (manualFlight.return.returnPrice == "") {
                delete manualFlight.return
            } else {
                manualFlight.return.returnDateTime = new Date(manualFlight.return.returnDateTime).toISOString()
            }

            console.log("Creating new flight")
            const flightData = await generateFlights(1, manualFlight)
            const flights = await insertNewFlights(flightData)
            if (flights.length == 1) {
                req.session.alertData = {
                    header: "Add One Way Flight Done Successfully",
                    content: `flight to ${flights[0].arrival.city} added to DB`
                }

            } else if (flights.length == 2) {
                req.session.alertData = {
                    header: "Add Route Flight Done Successfully",
                    content: `flight to ${flights[0].arrival.city} and back from ${flights[1].arrival.city} added to DB`
                }
            }
        }
        res.redirect("/admin")
    }
    catch (error) {
        req.session.alertData = {
            header: "Add Flight Failed",
            content: `Error occured, please try again`
        }
        console.error('Error:', error);
    }
})

router.post("/admin/auth", async (req, res) => {
    const { username: username, action: action } = req.body
    let status;
    if (!action) {
        status = 2
    }
    else if (action == "delete") {
        status = await deleteUser(username)
    } else {
        status = await updateUser(username, "authLevel", req.body.newAuthLevel)
    }
    if (status == 0) {
        req.session.alertData = {
            header: action == "delete" ? "Delete User" : "Update User",
            content: `Done Successfully`
        }
    } else if (status == 1) {
        req.session.alertData = {
            header: action == "delete" ? "Delete User Failed" : "Update User Failed",
            content: `User Not Found`
        }
    } else if (status == 2) {
        req.session.alertData = {
            header: "Modify Admin User",
            content: `It not possible to Modify Admin While no other admin exist`
        }
    } else {
        req.session.alertData = {
            header: action == "delete" ? "Delete User Failed" : "Update User Failed",
            content: `Error occur when deleting, please TRY AGAIN`
        }
    }
    res.redirect("/admin")
})



module.exports = router;