function validatePassword() {
  const registerForm = $('#register-form')
  registerForm.on('submit', () => {
    let password = $("#password").val()
    let passwordAauthentication = $("#password-authentication").val()
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (password !== passwordAauthentication) {
      alert("Passwords do not match.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters and include at least one letter, one number, and one special character.");
      return false;
    }
    return true;
  })
}

$(document).ready(function () {
  validatePassword()
});