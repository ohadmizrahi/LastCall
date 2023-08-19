// Function to add the user's name to the welcome message
function addName() {
    // Retrieve the user's name from cookies
    const userName = Cookies.get('name');
    
    // Check if the name exists
    if(userName) {
        // Update the welcome message with the user's name
        $('#welcome').text("Hello " + userName);
    } else {
        console.warn("User name not found in cookies.");
    }
}

// Call the function on document ready
$(document).ready(function() {
    addName();
});
