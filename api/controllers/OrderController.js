/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    var formData = req.params.all();
    
    if (req.param("access_token") && req.param("imei")) {
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

                var to_user = user;
                var from_pharmacy_id = req.param("pharmacy_id");
                var drug_id = req.param("drug_id");
              
                Pharmacy.findOne({
                  id: from_pharmacy_id
                }).exec(function (err, pharmacy) {
                  if (err) {
                    //TODO: Handle this error 
                  }

                  if (pharmacy) {
                    var from_pharmacy = pharmacy;
                    Drug.findOne({
                      id: drug_id
                    }).exec(function (err, drugs) {
                      if (err) {
                        //TODO: Handle this error 

                      }

                      if (drugs) {
                        var drug = drugs;
                        Order.create({
                          to_user: user,
                          from_pharmacy: from_pharmacy,
                          drug: drugs,
                          status:'pending'
                        }).exec(function (err, order) {
                          if (err) {
                            //TODO: Handle this error 

                          }

                          if (order) {
                            res.send(order);
                          }
                        });
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
  },

  getOrders: function (req, res) {
          console.log(req.params.all());
    //TODO: Figure out how to implement this function for both user and pharmacy
    if (req.param("imei") && req.param("access_token")) {
      //for Mobile apps
      req.param("access_token");
      User.findOne({
        access_token: req.param("access_token")
      }).exec(function (err, user) {
        if (user) {
          var owner = user.id;
          Device.findOne({
            imei: req.param("imei")
          }).exec(function (err, device) {
            if (err) {
              res.send({
                'error': err
              })
            }
            if (device) {
              if (device.owner === owner) {
                Order.find({
                  to_user: user.id
                }).populate('to_user').populate('from_pharmacy').populate('drug').exec(function (err, orders) {
                  if (err) {
                    //TODO: Handle errors
                  }

                  if (orders) {
                    res.send(orders);
                  }
                });
              } else {
                res.forbidden({
                  'forbidden': 'Access Denied'
                });
              }
            }
          });
        } else {
          res.forbidden({
            'forbidden': 'Access Denied'
          });
        }
      });
      //To be viewed by admin
    } else if (req.session.user && req.param("access_token")) {
      // console.log(req.params.all());
      if (req.session.user.access_token === req.param("access_token")) {
        var role = req.session.user.role;
        if (role.name === "admin") {
          Order.find().populate('to_user').populate('from_pharmacy').populate('drug').exec(function (err, orders) {
            if (err) {}
            //TODO: handle error

            if (orders) {
              res.send(orders);
            }
          });
        } else {

          res.forbidden({
            'forbidden': 'Access Denied'
          });

        }


      }

      //To be viewed by pharmacy admin
    } else if (req.session.Pharmacy.access_token === req.param("access_token")) {
            // console.log(req.params.all());
      var role = req.session.Pharmacy.role;
      var pharmacy = req.session.Pharmacy;
      if (role.name === "pharmacy-admin") {
        Order.find({
          from_pharmacy: pharmacy.id
        }).populate('to_user').populate('from_pharmacy').populate('drug').exec(function (err, orders) {
          if (err) { //TODO: handle errors
          }

          if (orders) {
            res.send(orders);
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


  },
  //Process order
  process:function(req, res){
    if (req.session.pharmacy.access_token === req.param("access_token")) {
      var role = req.session.Pharmacy.role;
      var pharmacy = req.session.pharmacy;
      if (role.name === "pharmacy-admin") {
        Order.update({id:req.param('order_id')},{status:'completed'}).exec(function afterwards(err, updated){
          if(err){
            //TODO: Perform error handling
          }

          if(updated){
            res.send(updated);

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


  }

  //process prescription drug


};
