const User = require("./userModel")

function findOrCreateUser(username, password) {
  const user = new User({
    username: username,
    password: password
  });
  return user
}

function newStrategy() {
  return User.createStrategy()
}

function findUserByID(id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
}

function insertNewUser(username, fName, lName, email, country, password) {
  console.log("Inserting new user ...");
  return new Promise((resolve, reject) => {
    User.register({
      username: username,
      fName: fName,
      lName: lName,
      email: email,
      country: country
    }, password, function (err, user) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}





module.exports.findOrCreateUser = findOrCreateUser
module.exports.newStrategy = newStrategy
module.exports.findUserByID = findUserByID
module.exports.insertNewUser = insertNewUser