require("dotenv").config()
const nodemailer = require('nodemailer');
const { faker } = require('@faker-js/faker');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_KEY
  },
  port: 465
});

function buildEmailData(to, subject, content) {
  return {
    from: process.env.EMAIL_ADDRESS,
    to: to,
    subject: subject,
    text: content
  }
};

function sendEmail(emailData) {
  transporter.sendMail(emailData, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  })
};

function buildEmailContent(user, flightData) {
  return `
  Dear ${user.name},

Thank you for choosing LastCall for your flight booking. We are excited to confirm your flight reservation details as follows:

Booking Reference: ${faker.number.int({ min: 111111, max: 999999 })}
Go Flight:
Flight Date: ${flightData.goDepDate}
Departure City: ${flightData.depCity}
Arrival City: ${flightData.arrCity}
Flight Number: ${flightData.goFlightNumber}

Return Flight:
Flight Date: ${flightData.returnDepDate || "No Data"}
Departure City: ${flightData.arrCity || "No Data"}
Arrival City: ${flightData.depCity || "No Data"}
Flight Number: ${flightData.returnFlightNumber || "No Data"}

Total Amount Paid: ${flightData.price}

We recommend arriving at the airport at least 3 hours before the departure time to ensure a smooth check-in process.

In case you have any questions or need to make changes to your booking, please feel free to contact our customer service team at lascalll2018@gmail.com We're here to assist you!

We're looking forward to providing you with a safe and enjoyable flight experience. Thank you for choosing LastCall. We wish you a pleasant journey!

Safe travels,

LastCall`
}

module.exports.buildEmailData = buildEmailData
module.exports.sendEmail = sendEmail
module.exports.buildEmailContent = buildEmailContent
