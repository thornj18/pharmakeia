/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function(req, res){
        var formData = req.params.all;
        if(req.param("access_token")&&req.param("imei")){
              User.findOne({access_token:req.param("access_token")}).exec(function(err, user){
          if (user) {
            var owner = user.id;
            Device.findOne({imei:req.param("imei")}).exec(function(err, device){
              if (device) {
                if (device.owner === owner) {

                    var to_user = user;
                    

                }else{
                  res.forbidden({'forbidden':'Access Denied'});
                }
              }else {
                res.forbidden({'forbidden':'Access Denied'});
              }
            });
          }else {
            res.forbidden({'forbidden':'Access Denied'});
          }
        });
        }
    },

    getOrders: function(req, res){
        //TODO: Figure out how to implement this function for both user and pharmacy
    }
	
};

