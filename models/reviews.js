const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    happyContent: {
        type: String,
        required: true
    },
    badContent: {
        type: String,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

async function findReviews(query = null) {
    try {
        let reviews = null;
        if (query) {
            console.log("Looking for reviews...");
            reviews = await Review.find(query)

        } else {
            console.log("Getting all reviews...");
            reviews = await Review.find()
        }
        if (reviews.length > 0) {
            return reviews
        } else {
            return false
        }
    }
    catch (error) {
        console.error("Error: error trying to find reviews", error)
    }
}

async function newReview(review) {
    review.destination = review.destination.charAt(0).toUpperCase() + review.destination.slice(1);
    await insertNewReview(review)
}


async function insertNewReview(review) {
    try {
        console.log("Start inserting new review");

        const {
            author: author,
            date: date,
            destination: destination,
            rank: rank,
            happyContent: happyContent,
            badContent: badContent
        } = review;

        const newReview = new Review({
            author: author,
            date: date,
            destination: destination,
            rank: rank,
            happyContent: happyContent,
            badContent: badContent
        })

        await newReview.save();

        console.log(`${insertCount} new reviews inserted to DB`)
    } catch (error) {
        throw new Error('Error finding or creating reviews: ' + error.message);
    }
}

module.exports.findReviews = findReviews
module.exports.newReview = newReview