function showSearchBar () {
    const currentPage = window.location.pathname;
    if (currentPage.includes('/flights')) {
        $(".search-bar").css("display", "block");
      } else {
        $(".search-bar").css("display", "none");
      }
}
showSearchBar()