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

async function deleteUser(username) {
  try {
    console.log(`Deleting User with username ${username}`);
    const adminValidationResult = await adminValidation(username)

    if (adminValidationResult) {
      const result = await User.deleteOne({
        username: username
      });
      console.log(result);
      if (result.deletedCount < 1) {
        return 1
      } else {
        return 0
      }
    } else {
      return 2
    }
  } catch (error) {
    console.error(error);
    return 3
  }
}

async function updateUser(username, fieldToUpdate, newVal) {
  try {
    console.log(`Updating User with username ${username}`);
    let adminValidationResult;
    if (fieldToUpdate == "authLevel") {
      adminValidationResult = await adminValidation(username)
    }
    if (adminValidationResult) {
      const result = await User.updateOne({
        username: username
      }, {
        [fieldToUpdate]: newVal
      });
      if (result.modifiedCount < 1) {
        return 1
      } else {
        return 0
      }
    } else {
      return 2
    }
  } catch (error) {
    console.error(error);
    return 3
  }
}

async function adminValidation(username) {
  const user = await User.findOne({
    username: username
  })
  if (user && user.authLevel == "admin") {
    const users = await User.find({
      authLevel: "admin"
    })
    if (users.length < 2) {
      console.log("Modify admin without new admin is not allowed");
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}


module.exports.findOrCreateUser = findOrCreateUser
module.exports.newStrategy = newStrategy
module.exports.findUserByID = findUserByID
module.exports.insertNewUser = insertNewUser
module.exports.deleteUser = deleteUser
module.exports.updateUser = updateUser