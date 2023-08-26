function toggleSales() {
  $(".toggle-sale").on("click", (event) => {
    const action = $(event.currentTarget).attr('data-action');
    const saleItems = $('.sale-item');
    const showLessBtn = $('#show-less-btn');
    const showMoreBtn = $('#show-more-btn');
  
    if (action === 'more') {
        const $hiddenDeals = $('.hidden-deal');
        $hiddenDeals.slice(0, 5).removeClass('hidden-deal');
  
        if ($('.sale-item:not(.hidden-deal)').length > 5) {
            showLessBtn.show();
        }
  
        if ($('.hidden-deal').length === 0) {
            showMoreBtn.hide();
        }
  
    } else if (action === 'less') {
        saleItems.slice(5).addClass('hidden-deal');
        showLessBtn.hide();
        showMoreBtn.show();
    }
  })

}

function updateShowMoreButtonVisibility() {
  const $hiddenDeals = $('.hidden-deal');
  const $showMoreBtn = $('#show-more-btn');

  if ($hiddenDeals.length > 0) {
      $showMoreBtn.show();
  } else {
      $showMoreBtn.hide();
  }
}

$(document).ready(function() {
  updateShowMoreButtonVisibility();
  toggleSales()
})
