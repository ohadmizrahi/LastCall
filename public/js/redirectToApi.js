function cubeRediredtTo() {
$(".cube").click(function () {
    const apiURL = $(this).data("api");
    window.location.href = apiURL;
});
}
cubeRediredtTo()

function rediredtToFlights() {
    $(".to-flights").click(function () {
        window.location.href = '/flights';
    });
}
rediredtToFlights()