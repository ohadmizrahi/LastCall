
$(".cube").click(function () {
    const apiURL = $(this).data("api");
    window.location.href = apiURL;
});