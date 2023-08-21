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
  try {
    transporter.sendMail(emailData, (error, info) => {
      if (error) {
        throw new Error('Error sending email: ' + error.message);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}


function buildEmailContent(user, flightData) {
  const goFlightContent = createFlightContent(flightData.go)
  let returnFlightContent;
  if (flightData.return) {
    returnFlightContent = createFlightContent(flightData.return)
  }
  return `
  Dear ${user.fName} ${user.lName},

Thank you for choosing LastCall for your flight booking. We are excited to confirm your flight reservation details as follows:

Booking Reference: ${faker.number.int({ min: 111111, max: 999999 })}
Go Flight:
${goFlightContent}

Return Flight:
${returnFlightContent || "No Return Flight"}

Total Amount Paid: $${Math.floor(flightData.totalPrice)}

We recommend arriving at the airport at least 3 hours before the departure time to ensure a smooth check-in process.

In case you have any questions or need to make changes to your booking, please feel free to contact our customer service team at lascalll2018@gmail.com We're here to assist you!

We're looking forward to providing you with a safe and enjoyable flight experience. Thank you for choosing LastCall. We wish you a pleasant journey!

Safe travels,

LastCall`
}

function createFlightContent(flight) {
  const date = new Date(flight.departure.dateTime)
  const timeOffest = date.getTimezoneOffset()
  date.setMinutes(date.getMinutes() + timeOffest)
  return `Flight Date: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}
Departure Time: ${date.getHours()}:${date.getMinutes()}
Departure City: ${flight.departure.city}
Arrival City: ${flight.arrival.city}
Flight Number: ${flight.flight.iata}`
}

module.exports.buildEmailData = buildEmailData
module.exports.sendEmail = sendEmail
module.exports.buildEmailContent = buildEmailContent
