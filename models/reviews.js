const reviews = [{
    author: "Ohad Mizrahi",
    date: "July 29, 2023",
    destination: "NYC",
    rank: "9.5",
    happyContent: "This is an amazing city",
    badContent: "very loud"
}, 
{
    author: "Or Solomon",
    date: "July 27, 2023",
    destination: "Thailand",
    rank: "7.5",
    happyContent: "Dont like in vary much, only food is good",
    badContent: "very loud"   
}, 
{
    author: "Osher Edri",
    date: "July 28, 2023",
    destination: "Dubai",
    rank: "4.5",
    happyContent: "Vey interesting country, but very hot",
    badContent: "very loud"   
}
]
function getReviews() {
    return reviews
}

function addReview(review) {
    review.destination = review.destination.charAt(0).toUpperCase() + review.destination.slice(1);
    reviews.push(review)
}

module.exports.getReviews = getReviews
module.exports.addReview = addReview