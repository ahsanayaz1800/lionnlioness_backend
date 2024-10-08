var userModel = require("../models/userModel");
var pictureModel = require("../models/pictureModel");
var tagModel = require("../models/tagModel");
var passwordHash = require("password-hash");
var sendmail = require("../services/mailService");
const pool = require('../config/database')
module.exports = {
  getUser: async data => {
    var user = data.login;
    var pwd = data.pwd;

    // Check if the incoming password looks like a hashed password by matching the hash format (e.g., sha512$...)
    const isHashed = pwd.match(/^sha512\$\w+\$\d+\$.+/); 

    if (user.match(/@/)) {
        var result = await userModel.findOne("mail", user);
        if (result != "") {
            var hashed = result[0]["password"];
            if (result[0]["status"] == 0) {
                return { error: "Inactive account" };
            }

            // Handle based on whether the incoming password is a hash or plain text
            if (isHashed) {
                // Compare the hashes directly if the password is already hashed
                if (pwd === hashed) {
                    return { message: "Successfully User Retrieved", userData: result };
                } else {
                    return { error: "Incorrect login/password" };
                }
            } else {
                // Verify the password using the hashing library if it's plain text
                if (passwordHash.verify(pwd, hashed)) {
                    return { message: "Successfully User Retrieved", userData: result };
                } else {
                    return { error: "Incorrect login/password" };
                }
            }
        } else {
            return { error: "Incorrect login/password" };
        }
    } else {
        var result = await userModel.findOne("username", user);
        if (result != "") {
            var hashed = result[0]["password"];
            if (result[0]["status"] == 0) {
                return { error: "Inactive account" };
            }

            // Handle based on whether the incoming password is a hash or plain text
            if (isHashed) {
                // Compare the hashes directly if the password is already hashed
                if (pwd === hashed) {
                    return { message: "Successfully User Retrieved", userData: result };
                } else {
                    return { error: "Incorrect login/password" };
                }
            } else {
                // Verify the password using the hashing library if it's plain text
                if (passwordHash.verify(pwd, hashed)) {
                    return { message: "Successfully User Retrieved", userData: result };
                } else {
                    return { error: "Incorrect login/password" };
                }
            }
        } else {
            return { error: "Incorrect login/password" };
        }
    }
},

  // getUser: async data => {
    
  //   var user = data.login;
  //   var pwd = data.pwd;

  //   if (user.match(/@/)) {
  //     var result = await userModel.findOne("mail", user);
  //     if (result != "") {
  //       var hashed = result[0]["password"];
  //       if (result[0]["status"] == 0) return { error: "Inactive account" };
  //       if (passwordHash.verify(pwd, hashed))
  //         return { message: "Succesfully User Retrieved", userData: result };
  //       else return { error: "Incorrect login/password" };
  //     } else return { error: "Incorrect login/password" };
  //   } else {
  //     var result = await userModel.findOne("username", user);
  //     if (result != "") {
  //       var hashed = result[0]["password"];
  //       if (result[0]["status"] == 0) return { error: "Inactive account" };
  //       if (passwordHash.verify(pwd, hashed))
  //         return { message: "Succesfully User Retrieved", userData: result };
  //       else return { error: "Incorrect login/password" };
  //     } else return { error: "Incorrect login/password" };
  //   }
  // },
  findByEmail : async email => {
    try {
      const result = await pool.query({
        sql: "SELECT * FROM users WHERE mail = ?",
        values: [email]
      });
  
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  },
  doesUserLoginExist: async data => {
    var user = data.login;

    if (user.match(/@/)) {
      var result = await userModel.findOne("mail", user);
      if (result != "") {
        return { message: "User does exist", userData: result };
      } else return { error: "Incorrect login" };
    } else {
      var result = await userModel.findOne("username", user);
      if (result != "") {
        return { message: "User does exist", userData: result };
      } else return { error: "Incorrect login" };
    }
  },

  getUserIdFromUsername: async username => {
    try {
      var result = await userModel.findOne("username", username);
      if (result != "") return result[0].id;
      else return { error: "User not found" };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getUserData: async id => {
    try {
      var result = await userModel.findOne("id", id);
      return result[0];
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  verifyPasswordWithId: async (pwd, id) => {
    var result = await userModel.findOne("id", id);
    if (result) {
      var hashed = result[0]["password"];
      if (passwordHash.verify(pwd, hashed))
        return { status: "Password is valid" };
      else {
        return { status: "Password isn't valid" };
      }
    }
  },

  updatePasswordWithId: async (pwd, id) => {
    var updated = await userModel.updatePasswordWithId(pwd, id);
    if (updated !== "") {
      return { status: "Password updated with success" };
    } else {
      return { status: "An error has occurred" };
    }
  },

  updatePasswordWithKey: async (pwd, key) => {
    var updated = await userModel.updatePasswordWithKey(pwd, key);
    if (updated) {
      return { status: "Password updated with success" };
    } else {
      return { status: "An error has occurred" };
    }
  },

  getUserPictures: async id => {
    try {
      var result = await pictureModel.findOne("user_id", id);
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getProfilePicture: async id => {
    try {
      var result = await pictureModel.findProfile("user_id", id);
      if (result[0] === undefined) {
        result = "default";
        return result;
      } else return result[0]["base64"];
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getUserTags: async id => {
    try {
      var result = await tagModel.findOne(id);
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getAllTags: async () => {
    try {
      var result = await tagModel.findAllTags();
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  createUser: async (data, isGoogleUser = false) => {

    const plainPassword = data[4]
    var uniqid = (
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1)
    ).toString(16);
    data.push(uniqid);
    var created = await userModel.createOne(data);
    if (created) {
      var link = "https://localhost:3000/users/register/" + uniqid;
      if (isGoogleUser) {
        // Send password for Google users in the registration email
        await sendmail.registerMail(data[3], data[2], link, plainPassword);  // Send password (data[4] is pwd1)
      } else {
        // Send standard registration email
        await sendmail.registerMail(data[3], data[2], link);
      };


      return { status: "User created with success" };
    }
    return { status: "An error has occurred" };
  },

  resetUserPassword: async data => {
    var uniqid = (
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1)
    ).toString(16);
    var created = await userModel.setPasswordResetKey(data[0]["id"], uniqid);
    if (created) {
      var link = "https://localhost:3000/users/reset-password/" + uniqid;
      await sendmail.forgotPasswordMail(
        data[0]["mail"],
        data[0]["username"],
        link
      );
      return { status: "Reset password email sent with success" };
    }
  },

  extractBlockedUsers: async (tab, userID) => {
    var blocked = await userModel.getBlockedUsersFromMyId(userID);

    var result = [];
    var i = 0;
    while (i < tab.length)
      result.push(tab[i++]);

    var i = 0;
    while (i < result.length) {
      var k = 0;
      while (k < blocked.length) {
        if (result[i]["user_1"] == blocked[k]['user_id'] || result[i]["user_2"] == blocked[k]['user_id']) {
          for (var j=0; j < tab.length; j++)
            if (tab[j]['user_1'] == blocked[k]['user_id'] || tab[j]['user_2'] == blocked[k]['user_id'])
              tab.splice(j, 1);
        }
        k++;
      }
      i++;
    }
    return tab;
  }
};
