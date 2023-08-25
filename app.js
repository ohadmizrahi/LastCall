require('dotenv').config()
const express = require("express");
const session = require('express-session');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const createDBConn = require("./models/dbConnector")
const loginRouter = require('./routes/auth')
const regiterRouter = require('./routes/register')
const homeRoute = require('./routes/home')
const destinationRoute = require('./routes/destination')
const flightRoute = require('./routes/flight')
const reviewRoute = require('./routes/review')
const adminRoute = require('./routes/admin')
const { getAllSales } = require('./models/sale/saleService')

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

// To handle get and post request for login
app.use(loginRouter)

// To handle get and post request for register
app.use(regiterRouter)

// To handle get request for home page
app.use(homeRoute)

// To handle get request for destination page
app.use(destinationRoute)

// To handle get request for flight page
app.use(flightRoute)

// To handle get request for review page
app.use(reviewRoute)

// To handle get request for admin actions
app.use(adminRoute)


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

createDBConn()

app.get("/", async (req, res) => {
  const data = await getAllSales()
  res.render("index", {
    body: {main: "partials/generalBodies/landing"},
    header: {main: "partials/headers/main", auth: "authDiv/beforeAuth", pageTitle: "Welcome"},
    sales: {main:"../generalPartials/salesBar",data:  data}

  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listen on http://localhost:${process.env.PORT}`);
})

