
function resetInput(element) {
    $(element).val('');
}

function applyFilters() {
    $('#reviews-wrapper').hide(1000, () => {
    
    const selectedDestination = $('#destination-input-filter').val().toLowerCase();
    const selectedRank = $('#rank-filter').val();

    const reviewsContainer = $('#reviews-container');
    const reviews = reviewsContainer.children('.review');

    reviews.show()

    if (selectedDestination !== 'all') {
        reviews.each(function() {
            const review = $(this);
            const destination = review.find('.review-dest').text().toLowerCase();
            if (destination !== selectedDestination) {
                review.hide();
            }
        });
    }

    if (selectedRank !== 'all') {
        reviews.filter(function() {
            const rank = parseFloat($(this).find('.review-rank').text());
            return (selectedRank === '9' && rank < 9) ||
                   (selectedRank === '7' && (rank < 7 || rank >= 9)) ||
                   (selectedRank === '5' && (rank < 5 || rank >= 7)) ||
                   (selectedRank === '4' && rank >= 5);
        }).hide();
    }});
    $('#reviews-wrapper').show(300);
}

function sortReviews() {
    const sortingOption = $('#date-sort').val();
    const reviewsContainer = $('#reviews-container');
    const reviews = reviewsContainer.children('.review');
    switch (sortingOption) {
        case 'latest':
            reviews.sort(function(a, b) {
                const dateA = new Date($(a).find('.review-date').text());
                const dateB = new Date($(b).find('.review-date').text());
                return dateB - dateA;
            });
            break;
        case 'oldest':
            reviews.sort(function(a, b) {
                const dateA = new Date($(a).find('.review-date').text());
                const dateB = new Date($(b).find('.review-date').text());
                return dateA - dateB;
            });
            break;
        case 'highest':
            reviews.sort(function(a, b) {
                const rankA = parseFloat($(a).find('.review-rank').text());
                const rankB = parseFloat($(b).find('.review-rank').text());
                return rankB - rankA;
            });
            break;
        case 'lowest':
            reviews.sort(function(a, b) {
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
    $('#review-form').on('submit', function(event) {
        event.preventDefault();
        let newReview = {}
        
        newReview.author = Cookies.get('name').replace(/\w\S*/g, function(t) { return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase(); });
        newReview.date = new Date().toLocaleDateString('en-US',{ year: 'numeric', month: 'long', day: 'numeric' });
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

})};


sortReviews(); // for default desc sort
newReview();

