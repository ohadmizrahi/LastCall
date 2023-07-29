const { Router } = require('express');
const Sale = require('../models/sale')

const router = Router();


/*
router.get("/addSale", function (req, res) {
  res.render("index", {
    body: {main: "partials/bodies/addSale"},
    header: {main: "partials/headers/header", auth: "authDiv/afterAuth"}
  })
});

router.post("/addSale", function (req, res) {
  const newSale = new Sale({
    destination: req.body.destination,
    deal_dates: req.body.deal_dates,
    min_price: req.body.min_price
  });

  newSale.save(function(err) {
    if (err) {
      console.log(err);
      res.redirect("/addSale");
    } else {
      res.redirect("/sales")  // Redirect to a page that lists all sales, adjust as needed
    }
  });
});
*/


router.get("/sales", function(req, res) {
  const sales = getSales();
  res.render("partials/salesBar", { sales: sales });
});

module.exports = router;