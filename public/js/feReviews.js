
function resetInput(element) {
    $(element).val('');
}
function handleEnterKey(event) {
    if (event.key === "Enter") {
        applyFilters();
    }
}

function matchRank(selectedRank, reviewRank) {
    switch (selectedRank) {
        case 'all':
            return true;
        case '9':
            return reviewRank > 9;
        case '7':
            return reviewRank >= 7 && reviewRank <= 9;
        case '5':
            return reviewRank >= 5 && reviewRank < 7;
        case '4':
            return reviewRank < 5;
        default:
            return false;
    }
}

function applyFilters() {
    $('#reviews-wrapper').hide(1000, () => {

        const selectedDestination = $('#destination-input-filter').val().toLowerCase();
        const selectedRank = $('#rank-filter').val();
        const reviewsData = $("#reviews-data");

        let reviewsArray;
        if (reviewsData.length > 0) {
            reviewsArray = JSON.parse(reviewsData.attr("data-reviews"));
        }

        const filteredReviews = reviewsArray.filter(review => {
            const destinationMatches = selectedDestination === 'all' || review.destination.toLowerCase() === selectedDestination;
            const rankMatches = matchRank(selectedRank, parseFloat(review.rank));

            return destinationMatches && rankMatches;
        });

        const reviewsContainer = $("#reviews-container")
        reviewsContainer.empty()

    });

    $('#reviews-wrapper').show(300);
}



function sortReviews() {
    const sortingOption = $('#date-sort').val();
    const reviewsContainer = $('#reviews-container');
    const reviews = reviewsContainer.children('.review');
    switch (sortingOption) {
        case 'latest':
            reviews.sort(function (a, b) {
                const dateA = new Date($(a).find('.review-date').text());
                const dateB = new Date($(b).find('.review-date').text());
                return dateB - dateA;
            });
            break;
        case 'oldest':
            reviews.sort(function (a, b) {
                const dateA = new Date($(a).find('.review-date').text());
                const dateB = new Date($(b).find('.review-date').text());
                return dateA - dateB;
            });
            break;
        case 'highest':
            reviews.sort(function (a, b) {
                const rankA = parseFloat($(a).find('.review-rank').text());
                const rankB = parseFloat($(b).find('.review-rank').text());
                return rankB - rankA;
            });
            break;
        case 'lowest':
            reviews.sort(function (a, b) {
                const rankA = parseFloat($(a).find('.review-rank').text());
                const rankB = parseFloat($(b).find('.review-rank').text());
                return rankA - rankB;
            });
            break;
        default:
            return;
    }
    reviewsContainer.append(reviews);
}

function openModal() {
    $("#add-review-modal").show();
}

function closeModal() {
    $("#add-review-modal").hide();
}

function newReview() {
    $('#review-form').on('submit', function (event) {
        event.preventDefault();
        let newReview = {}

        newReview.author = Cookies.get('name')
        newReview.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        newReview.destination = $('#destination').val();
        newReview.rank = $('#rank').val();
        newReview.happyContent = $('#happyContent').val();
        newReview.badContent = $('#badContent').val();

        const validDest = reviewDestinationValidation(newReview.destination)

        if (validDest) {

            fetch("/add_review", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReview)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        closeModal();
                        window.location.href = '/reviews';
                    } else {
                        alert('Failed to add review.');
                        window.location.href = '/reviews';
                    }
                })
                .catch(error => {
                    console.log(error);
                });

        } else {
            $('#destination').val("")
            alert("Not Valid Destination\n Re-Enter Destination")

        }
    })
};

function reviewDestinationValidation(destInput) {

    const validDestinationsElement = $("#validDestinations");
    const validDestinations = JSON.parse(validDestinationsElement.attr("data-destinations"));

    if (destInput && (!validDestinations.includes(destInput))) {
        return false
    } else {
        return true
    }
}


function buildDestinationOptions() {
    const validDestinationsElement = $("#validDestinations");
    const dataListElement = $(".destination-options")
    if (validDestinationsElement.length > 0) {
        const validDestinations = JSON.parse(validDestinationsElement.attr("data-destinations"));
        validDestinations.forEach(destination => {
            dataListElement.append($(`<option value="${destination}">`))
        });
    }

}

sortReviews(); // for default desc sort
newReview();
buildDestinationOptions()

