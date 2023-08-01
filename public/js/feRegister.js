function validatePassword() {
    var password = document.getElementById("password").value;
    var passwordAuthentication = document.getElementById("passwordAuthentication").value;

    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (password !== passwordAuthentication) {
      alert("Passwords do not match.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters and include at least one letter, one number, and one special character.");
      return false;
    }
  
    return true; 
}