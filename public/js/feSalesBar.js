function toggleSales(action) {
  const saleItems = document.querySelectorAll('.sale-item');
  const showLessBtn = document.getElementById('show-less-btn');
  const showMoreBtn = document.getElementById('show-more-btn');

  if (action === 'more') {
    const hiddenDeals = document.querySelectorAll('.hidden-deal');

    // Show the next 5 hidden deals
    for (let i = 0; i < Math.min(hiddenDeals.length, 5); i++) {
      hiddenDeals[i].classList.remove('hidden-deal');
    }

    // Update the "Show Less" button's display
    if (document.querySelectorAll('.sale-item:not(.hidden-deal)').length > 5) {
      showLessBtn.style.display = 'inline';
    }

    // If there are no more hidden deals, hide the "Show More" button
    if (document.querySelectorAll('.hidden-deal').length === 0) {
      showMoreBtn.style.display = 'none';
    }
  } else if (action === 'less') {
    // Hide all but the first 5 sale items
    for (let i = 5; i < saleItems.length; i++) {
      saleItems[i].classList.add('hidden-deal');
    }

    // Hide the "Show Less" button and show the "Show More" button
    showLessBtn.style.display = 'none';
    showMoreBtn.style.display = 'inline';
  }
}

function updateShowMoreButtonVisibility() {
  const hiddenDealsCount = $('.hidden-deal').length;
  const $showMoreBtn = $('#show-more-btn');

  if (hiddenDealsCount > 0) {
    $showMoreBtn.show();
  } else {
    $showMoreBtn.hide();
  }
}

// Call the function when the document is ready
$(document).ready(updateShowMoreButtonVisibility);
