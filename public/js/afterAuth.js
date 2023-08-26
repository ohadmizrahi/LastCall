
function addName() {
    const userName = Cookies.get('name');
    
    if(userName) {
        $('#welcome').text("Hello " + userName);
    } else {
        console.warn("User name not found in cookies.");
    }
}

$(document).ready(function() {
    addName();
});
