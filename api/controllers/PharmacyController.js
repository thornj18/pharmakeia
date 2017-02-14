var bcrypt = require('bcryptjs');
var randtoken = require('rand-token');
var distance = require('google-distance');
var async = require('async');
/**
 * PharmacyController
 *
 * @description :: Server-side logic for managing Pharmacies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var pharmacyArray = new Array();

function locate(pharmacy, myLocation, callback) {
  var latitude = pharmacy.latitude;
  var longitude = pharmacy.longitude;

  var pharmLocation = latitude + "," + longitude;


  distance.get({
    index: 1,
    origin: '-6.791342,39.067878',
    destination: '-6.816247,39.289503'
  }, function (err, data) {
    if (err)
      console.log(err);
    if (data) {
      var distance = data.distanceValue;
      var nearPharmacy = {
        pharmacy: pharmacy,
        distance: distance
      };

      callback(nearPharmacy);
    }
  });
}

function compare(a, b) {
  if (a.distance < b.distance)
    return -1;
  if (a.distance > b.distance)
    return 1;
  return 0;
}


function auth(email, password, callback) {
  if (email && password) {
    Pharmacy.findOne({
      email: email
    }).exec(function (err, Pharmacy) {
      if (err) {
        callback({
          'message': err
        });
      } else {
        if (!Pharmacy || typeof Pharmacy === 'undefined') {
          callback({
            'message': 'Could not find Pharmacy, sorry.'
          });
        } else {
          bcrypt.compare(password, Pharmacy.password, function (err, realPharmacy) {
            if (!realPharmacy) {
              callback({
                'message': 'Invalid Password'
              });
            } else {
              var token = randtoken.generate(16);
              Pharmacy.access_token = token;
              Pharmacy.save();


              Role.findOne({
                id: Pharmacy.role
              }).exec(function (err, role) {
                if (role) {
                  var returnPharmacy = {
                    name: Pharmacy.name,
                    email: Pharmacy.email,
                    phone: Pharmacy.phone,
                    createdAt: Pharmacy.createdAt,
                    id: Pharmacy.id,
                    role: role,
                    access_token: Pharmacy.access_token
                  };
                  callback({
                    'Pharmacy': returnPharmacy
                  });
                } else {
                  callback({
                    'error': 'no role'
                  });
                }

              });
            }
          });
        }
      }
    });
  } else {
    callback({
      'message': 'Please fill all fields'
    });
  }
}


module.exports = {

  //Creates new Pharmacy 

  create: function (req, res) {
    var formData = req.params.all();

    Pharmacy.findOne({
      email: formData.email
    }).exec(function (err, Pharamcy) {
      if (Pharamcy) {
        // console.log("Pharmacy found!");
        res.send({
          'message': 'Pharmacy already exists'
        });
      } else {
        // console.log("create Pharmacy");
        Pharmacy.create(formData).exec(function (err, created) {
          if (created) {
            var pharmacy_created = {
              name: created.name,
              email: created.email,
              location: created.location
            };
            res.send({
              'message': pharmacy_created
            });
          } else if (err) {
            res.send({
              'error': err
            });
          } else {
            //TODO: Some error occurred
          }
        });
      }
    });



  },

  //Signs in the pharmacy using the given credentials

  login: function (req, res) {
    auth(req.param("email"), req.param("password"), function (data) {
      if (data) {
        req.session.Pharmacy = data.Pharmacy;
        res.send(data);
      } else {
        res.forbidden({
          "Forbidden": "Access Denied!"
        });
      }

    });
  },

  //Gets the logged in pharmacy 

  get: function (req, res) {
    if (req.session.Pharmacy && req.param("access_token")) {
      if (req.session.Pharmacy.access_token === req.param("access_token")) {
        var owner = req.session.Pharmacy.id;
        res.send(req.session.Pharmacy);

      }
    }
  },

  //Retrieves all the pharmacies with the particular name

  search: function (req, res) {
    var name = req.param('name');
    Pharmacy.findOne({
      'name': name
    }).exec(function (err, pharm) {
      if (err) {
        res.send({
          'error': err
        });
      }

      if (pharm) {
        var pharmacy = {
          name: pharm.name,
          phone: pharm.phone,
          location: pharm.location,
          lat: pharm.latitude,
          long: pharm.longitude,
          email: pharm.email
        };
        res.send({
          'pharmacy': pharmacy
        });
      }
    });
  },

  //Lists all the registered pharmacies to the admin

  list: function (req, res) {
    if (req.session.user && req.param("access_token")) {
      if (req.session.user.access_token === req.param("access_token")) {
        var role = req.session.user.role;
        if (role.name === "admin") {
          Pharmacy.find().exec(function (error, pharmacies) {
            if (error) res.send(error);
            if (pharmacies) {
              res.send({
                'pharmacies': pharmacies
              });
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

  getNearPharmacies: function (req, res) {
    if (req.param('access_token') && req.param('imei')) {
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

                var latitude = req.param('latitude');
                var longitude = req.param('longitude');

                var origin = latitude + "," + longitude;

                Pharmacy.find().exec(function (err, pharmacies) {
                  if (err) {
                    res.send({
                      "error": err
                    });
                  }

                  if (pharmacies) {
                    async.each(pharmacies,function (pharmacy, callback) {

                      locate(pharmacy, origin, function(data){
                        
                        if(data){
                          pharmacyArray.push(data);
                          callback();
                        }
                      });
                      
                    }, function(err){
                      if(err){
                        console.log(err);
                      }else{
                        obj.sort(compare);
                        res.send(pharmacyArray);
                      }
                    });

                  }
                });

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

  }



};
