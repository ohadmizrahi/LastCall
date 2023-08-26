function initializeLoginForm() {
    const $loginForm = $('#login-form');
    const $submitButton = $('#submit-login-form');
    $submitButton.click(function(event) {
        event.preventDefault();
        $loginForm.submit();
    });
}
$(document).ready(initializeLoginForm);
