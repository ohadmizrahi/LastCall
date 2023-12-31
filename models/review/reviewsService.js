const Review = require("./reviewModel")

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

async function insertNewReview(review) {
    try {
        console.log("Start inserting new review");
        if (review.destination) {
            review.destination = review.destination.charAt(0).toUpperCase() + review.destination.slice(1);
        } else {
            return 2
        }

        const {
            author: author,
            date: date,
            destination: destination,
            rank: rank,
            happyContent: happyContent,
            badContent: badContent
        } = review;

        const existingReview = await Review.findOne({
            'author': author,
            'date': date,
            'destination': destination
        }
        )
        if (!existingReview) {
            console.log("Creating new review");
            const newReview = new Review({
                author: author,
                date: date,
                destination: destination,
                rank: rank,
                happyContent: happyContent,
                badContent: badContent
            })

            await newReview.save();
            return 0
        } else {
            console.log("Review already exist");
            return 1
        }

    } catch (error) {
        return 3
    }
}

module.exports.findReviews = findReviews
module.exports.insertNewReview = insertNewReview