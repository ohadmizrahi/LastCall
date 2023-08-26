
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
    const selectedDestination = capitalizeFirstLetter($('#destination-input-filter').val());
    $('.review').each(function () {
        const reviewRank = parseFloat($(this).find('.review-rank').text().split(':')[1].trim());
        const reviewDestination = $(this).find('.review-dest').text().trim();
        const destinationMatch = selectedDestination === 'All' || reviewDestination.startsWith(selectedDestination);
        if (matchRank(selectedRank, reviewRank) && destinationMatch) {
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
    reviews.closest('.col-md-10').fadeOut('slow', function () {

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

        reviews.each(function () {
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

        fetch("/add_review", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReview)
        })
            .then(response => response.json())
            .then(data => {
                closeModal();
                window.location.href = '/reviews';
            })
            .catch(error => {
                console.log(error);
            });

    })
};


function capitalizeFirstLetter(string) {
    if (typeof string !== 'string' || !string) {
        console.warn('Invalid input provided to capitalizeFirstLetter function');
        return ''; 
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


function initDestinationReviewsFilter() {
    // Check if the hidden input exists
    if ($('#destination-name').length) {
        // Set the destination filter's value using the hidden input's value
        $('#destination-input-filter').val($('#destination-name').val());
        // Apply filters to show the relevant reviews
        applyFilters();
    }
}

applyFilters();
$(document).ready(initDestinationReviewsFilter);
sortReviews(); // for default desc sort
newReview();

$(document).ready(function() {
    updateAuthorInitials();
});

function updateAuthorInitials() {
    $('.author-initials').each(function() {
        const authorName = $(this).data('author-name');
        const initials = authorName.split(' ').map(name => name.charAt(0)).join('');
        $(this).text(initials);
    });
}
