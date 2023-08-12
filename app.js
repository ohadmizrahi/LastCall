require('dotenv').config()
const express = require("express");
const session = require('express-session');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const createDBConn = require("./models/dbConnector")
const loginRouter = require('./routes/auth')
const regiterRouter = require('./routes/register')
const homeRoute = require('./routes/home')
const menuRoute = require('./routes/services')
const orderRoute = require('./routes/orderFlight')
const { getSales } = require('./models/sale')

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

// To handle get and post request for login
app.use(loginRouter)


// To handle get and post request for register
app.use(regiterRouter)

// To handle get request for home
app.use(homeRoute)

// To handle get request for menu
app.use(menuRoute)

app.use(orderRoute)

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

createDBConn()

app.get("/", (req, res) => {
  const data = getSales()
  res.render("index", {
    body: {main: "partials/bodies/landing"},
    header: {main: "partials/headers/header", auth: "authDiv/beforeAuth", pageTitle: "Welcome"},
    sales: {main:"../salesBar",data:  data}

  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listen on http://localhost:${process.env.PORT}`);
})

