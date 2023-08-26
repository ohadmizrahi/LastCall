
function resetInput() {
    const destFilter = $("#destination-input-filter")
    destFilter.on("click", () => {
        $(destFilter).val('');
    })

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
    const reviewFilters = $(".review-filters")
    reviewFilters.on("input", () => {
        const selectedRank = $('#rank-filter').val();
        const selectedDestination = capitalizeFirstLetter($('#destination-input-filter').val());
        $('.review').each(function () {
            const reviewRank = parseFloat($(this).find('.review-rank').text().split(':')[1].trim());
            const reviewDestination = $(this).find('.review-dest').text().trim();
            const destinationMatch = selectedDestination === 'All' || reviewDestination.startsWith(selectedDestination);
            if (matchRank(selectedRank, reviewRank) && destinationMatch) {
                $(this).slideDown();
            } else {
                $(this).slideUp();
            }
        });
    })

}

function sortReviews() {
    const reviewSort = $('#reviews-sort')
    reviewSort.on("change", () => {
        const sortingOption = reviewSort.val();
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

            reviews.closest('.col-md-10').fadeIn('slow');
        });
    })
}


function toggleNewReviewModal() {
    const addReviewButton = $("#add-review-btn")
    const closeReviewModalButton = $("#close-modal-btn")

    addReviewButton.on("click", () => {
        $("#add-review-modal").show();
    })

    closeReviewModalButton.on("click", () => {
        $("#add-review-modal").hide();
    })
}

function newReview() {
    $('#review-form').on('submit', function (event) {
        event.preventDefault();
        let newReviewObject = {}

        newReviewObject.author = Cookies.get('name')
        newReviewObject.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        newReviewObject.destination = $('#destination').val();
        newReviewObject.rank = $('#rank').val();
        newReviewObject.happyContent = $('#happyContent').val();
        newReviewObject.badContent = $('#badContent').val();

        fetch("/add_review", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReviewObject)
        })
            .then(response => response.json())
            .then(data => {
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
    if ($('#destination-name').length) {
        $('#destination-input-filter').val($('#destination-name').val());
        applyFilters();
    }
}

function updateAuthorInitials() {
    $('.author-initials').each(function () {
        const authorName = $(this).data('author-name');
        const initials = authorName.split(' ').map(name => name.charAt(0)).join('');
        $(this).text(initials);
    });
}

$(document).ready(function () {
    updateAuthorInitials();
    sortReviews(); // for default desc sort
    newReview();
    applyFilters();
    resetInput()
    initDestinationReviewsFilter()
    toggleNewReviewModal()

});
