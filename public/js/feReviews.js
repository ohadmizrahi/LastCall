
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
    const selectedRank = $('#rank-filter').val();
    const selectedDestination = $('#destination-input-filter').val();

    $('.review').each(function() {
        const reviewRank = parseFloat($(this).find('.review-rank').text().split(':')[1].trim());
        const reviewDestination = $(this).find('.review-dest').text().trim();

        if (matchRank(selectedRank, reviewRank) && (selectedDestination === 'All' || selectedDestination === reviewDestination)) {
            $(this).slideDown(); // For slide-down effect
        } else {
            $(this).slideUp(); // For fade-out effect
        }
    });
}




function sortReviews() {
    const sortingOption = $('#date-sort').val();
    const reviewsContainer = $('#reviews-container');
    const reviews = reviewsContainer.children('.col-md-10').find('.review');
    reviews.closest('.col-md-10').fadeOut('slow', function() {

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
                const rankA = parseFloat($(a).find('.review-rank').text().split(":")[1].trim());
                const rankB = parseFloat($(b).find('.review-rank').text().split(":")[1].trim());
                return rankB - rankA;
            });
            break;
        case 'lowest':
            reviews.sort(function (a, b) {
                const rankA = parseFloat($(a).find('.review-rank').text().split(":")[1].trim());
                const rankB = parseFloat($(b).find('.review-rank').text().split(":")[1].trim());
                return rankA - rankB;
            });
            break;
        default:
            return;
    }

    reviews.each(function() {
        reviewsContainer.append($(this).closest('.col-md-10'));
    });

    // End animation: fade in all reviews in their sorted order.
    reviews.closest('.col-md-10').fadeIn('slow');
});
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
applyFilters();

sortReviews(); // for default desc sort
newReview();
buildDestinationOptions()

