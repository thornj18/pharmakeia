var bcrypt = require('bcryptjs');
var randtoken = require('rand-token');
/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function auth(phone,password, callback){
  if(phone && password){
    User.findOne({phone:phone}).exec(function(err, user){
      if (err) {
        callback({'message': err});
      } else {
        if (!user || typeof user === 'undefined') {
          callback({'message': 'Could not find User, sorry.'});
        }else{
          bcrypt.compare(password, user.password, function (err, realuser) {
            if (!realuser){
              callback({'message': 'Invalid Password'});
            }else{
              var token = randtoken.generate(16);
              user.access_token = token;
              user.save();

              Role.findOne({id:user.role}).exec(function(err, role){
                if(role){
                  var returnUser = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt,
                    id: user.id,
                    role: role,
                    access_token: user.access_token
                  };
                  callback({'user': returnUser});
                }else{
                  callback({'error': 'no role'});
                }

              });
            }
          });
        }
      }
    });
  }else{
    callback({'message': 'Please fill all fields'});
  }
}

module.exports = {
  getUser: function (req, res) {
    if (req.param("imei")&&req.param("access_token")&&req.param("phone")) {
      User.findOne({access_token:req.param("access_token")}).exec(function(err, user){
        if (user) {
          var owner = user.id;
          Device.findOne({imei:req.param("imei")}).exec(function(err, device){
            if (err) {
              //TODO: Handle the error from this query
            }
            if (device) {
              if (device.owner === owner) {
                User.findOne({phone:req.param("phone")}).exec(function(error, foundUser){
                  if (error) {
                    //TODO: Handle the error from this query
                    res.send(error);
                  }
                  if (foundUser) {
                    var gotUser = {name:foundUser.name, email:foundUser.email, id:foundUser.id, phone:foundUser.phone};
                    res.send(gotUser);
                  }
                });
              }else{
                res.forbidden({'forbidden':'Access Denied'});
              }
            }
          });
        }else {
          res.forbidden({'forbidden':'Access Denied'});
        }
      });
    }else if (req.session.user&&req.param("access_token")&&req.param("phone")) {
      if (req.session.user.access_token === req.param("access_token")) {
        User.findOne({phone:req.param("phone")}).exec(function(error, user){
          if (error) {
            //TODO: Handle the error from this query
          }
          if (user) {
            var foundUser = {name:user.name, email:user.email, id:user.id, phone:user.phone};
            res.send(foundUser);
          }
        });
      }else{
        res.send("Access token does not match");
      }
    }else{
      res.send("Not enough params");
    }

  },

  get: function (req, res) {
    if (req.session.user && req.param("access_token")) {
      if (req.session.user.access_token === req.param("access_token")) {
        var owner = req.session.user.id;
        res.send(req.session.user);

      }
    } else if (req.param("access_token") && req.param("imei")) {
      User.findOne({
        access_token: req.param("access_token")
      }).exec(function (err, user) {
        if (user) {
          var owner = user.id;
          Device.findOne({
            imei: req.param("imei")
          }).exec(function (err, device) {
            if (device) {
              if (device.owner === owner) {
                res.send(user);
              } else {
                res.forbidden({
                  'forbidden': 'Access Denied'
                });
              }
            } else {
              res.forbidden({
                'forbidden': 'Access Denied'
              });
            }
          });
        } else {
          res.forbidden({
            'forbidden': 'Access Denied'
          });
        }
      });
    } else {
      res.forbidden({
        'forbidden': 'Access Denied'
      });
    }
  },

  list: function (req, res) {
    if (req.session.user && req.param("access_token")) {
      if (req.session.user.access_token === req.param("access_token")) {
        var role = req.session.user.role;
        if (role.name === "admin") {
          User.find().exec(function (error, users) {
            if (error) res.send(error);
            if (users) {
              res.send(users);
            }
          });
        } else {

          res.forbidden({
            'forbidden': 'Access Denied'
          });

        }


      }
    } else {
      res.forbidden({
        'forbidden': 'Access Denied'
      });
    }

  },

  logout: function(req, res) {
      if (req.param("imei")&&req.param("access_token")) {
        User.findOne({access_token:access_token}).exec(function(err, user){
          if (user) {
            Device.findOne({imei:"imei"}).exec(function(err, device){
              if (device) {
                device.owner.remove();
                user.access_token.remove();
                res.send({'logout':'User has been logged out'});
              }else{
                res.forbidden("Access Denied");
              }
            });
          }else {
            res.send("User must be logged in to perform this");
          }
        });
      }else if(req.session.user&&req.param("access_token")){
        if (req.session.user.access_token === req.param("access_token")) {
          console.log(req.session.user.access_token);
          console.log(req.param("access_token"));
          req.session.destroy(function(error){
            if (!error) {
              res.send({'logout':'User has been logged out'});
            }
          });
        }
      }else{
        res.forbidden({'forbidden':'Access Denied'});
      }
    },

  create: function (req, res) {
    var formdata = req.params.all();
    console.log(formdata);

    User.findOrCreate({
      phone: formdata.phone
    },
      formdata
    ).exec(function (err, user) {
      if (err) {
        console.log(err);

      }

      if (user) {
        res.send({
          'user': user
        });
      }


    });


  },

  login: function (req, res) {

    var formdata = req.params.all();
    var imei = "";
    if (formdata.imei) {
      imei = formdata.imei;
    }
    var phone = formdata.phone;
    var password = formdata.password;
    //check if imei exist and its a phone
    if (imei != "") {
      Device.findOne({
        imei: imei
      }).exec(function (err, device) {
        if (device) {
          User.findOne({
            device: device
          }).exec(function (err, user) {
            if (user) {
              auth(phone, password, function (data) {
                if (data) {
                  res.send(data);
                } else {
                  res.forbidden({
                    "forbidden": "Access Denied"
                  });
                }
              });
            } else {

              User.update({
                phone: phone
              }, {
                device: device
              }).exec(function (err, updated) {
                if (err) {
                  res.send(err);
                }
                if (updated) {
                  auth(phone, password, function (data) {
                    if (data) {
                      res.send(data);
                    } else {
                      res.forbidden({
                        "forbidden": "Access Denied"
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          res.forbidden({
            "forbidden": "Access Denied"
          });
        }
      });
    } else {

      //No Imei its a webapp
      auth(phone, password, function (data) {
        if (data) {
          req.session.user = data.user;
          res.send(data);
        } else {
          res.forbidden({
            "forbidden": "Access Denied"
          });
        }
      });
    }

  }

};
