function toggleSales() {
  $(".hidden-deal").toggle();
  var placeholderText = $(".hidden-deal").is(":visible") ? "Show Less" : "Show More";
  $("#show-more-btn").text(placeholderText);
}
