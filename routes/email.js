const { Router } = require('express');
const bodyParser = require("body-parser");
const { sendEmail, buildEmailData, buildEmailContent } = require("../models/email/emailService")

const router = Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/send_email", async (req, res) => {
    if (req.isAuthenticated()) {
        const subject = "Flight Order Confirmation - LastCall"
        const { user: user, flightData: flightData } = req.body

        const content = buildEmailContent(user, flightData)
        
        const emailData = buildEmailData(user.to, subject, content)
        sendEmail(emailData)
        
    } else {
        res.redirect("/login");
    }

})

module.exports = router;