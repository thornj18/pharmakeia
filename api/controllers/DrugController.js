/**
 * DrugController
 *
 * @description :: Server-side logic for managing Drug
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function reg(formData, callback){
    console.log(formData);
    Drug.create(formData).exec(function(err, created){
        if(err){
            callback({'error':err});
        }

        if(created){
            callback({'message':created});
        }
    });

}

function find(query, callback){
    Drug.find({brand_name:query}, {generic_name:query}).populate('owners').exec(function (err, drugs){
                    if(err){
                        callback({'error':err});
                    }

                    if(drugs){
                        callback({'drug':drugs})
                    }
    });
}

module.exports = {
	
    create: function(req, res) {
    if(req.session.user&&req.param("access_token")||req.session.Pharmacy&&req.param("access_token")){
      if (req.session.user.access_token === req.param("access_token")) {
        var role = req.session.user.role;
        if(role.name==="admin"){
            var email = req.param('email');
            var formData = req.params.all();
            Pharmacy.findOne({email:email}).exec(function(err, pharmacy){
                if(err){
                    //TODO: Handle errors!
                }

                if(pharmacy){
                    var form = {brand_name:formData.brand_name, generic_name:formData.generic_name, indications:formData.indications, 
                        contraindications:formData.contraindications, storage:formData.storage, caution:formData.caution, prescription:formData.prescription, price:formData.price, owners:pharmacy.id};
                        
                        reg(form, function(data){
                            if(data){
                               res.send(data);
                            }else{
                              res.forbidden({"forbidden":"Access Denied"});
                             }
                        });

                }
            });

            
            
        }else {

            res.forbidden({'forbidden':'Access Denied'});

        }


      }else if(req.session.pharmacy.access_token === req.param("access_token")){
        var role = req.session.Pharmacy.role;
        var pharmacy = req.session.pharmacy;
        if(role.name === "pharmacy-admin"){
           var formData = req.params.all();

           var form = {brand_name:formData.brand_name, generic_name:formData.generic_name, indications:formData.indications, 
                        contraindications:formData.contraindications, storage:formData.storage, caution:formData.caution, prescription:formData.prescription, price:formData.price, owners:pharmacy.id};
                        

            //Add pharmacy object into query
            reg(form, function(data){
                if(data){
                    res.send(data);
               }else{
                  res.forbidden({"forbidden":"Access Denied"});
                }
            });
        }
      }
    }else{
      res.forbidden({'forbidden':'Access Denied'});
    }

  },

    
    search: function(req, res){
        if(req.session.user&&req.param("access_token")||req.session.pharmacy&&req.param("access_token")){
            if(req.session.user.access_token===req.param("access_token")||req.session.pharmacy.access_token===req.param("access_token")){
                find(req.param('query'), function(data){
                    if(data){
                    res.send(data);
               }else{
                  res.forbidden({"forbidden":"Access Denied"});
                }
                });
            }
        }else if(req.param('imei')&&req.param('access_token')){
             User.findOne({access_token:req.param("access_token")}).exec(function(err, user){
          if (user) {
            var owner = user.id;
            Device.findOne({imei:req.param("imei")}).exec(function(err, device){
              if (device) {
                if (device.owner === owner) {
                   find(req.param('query'), function(data){
                    if(data){
                    res.send(data);
               }else{
                  res.forbidden({"forbidden":"Access Denied"});
                }
                });
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

    list: function(req, res) {
    if(req.session.user&&req.param("access_token")){
      if (req.session.user.access_token === req.param("access_token")) {
        var role = req.session.user.role;
        if(role.name==="admin"){
            Drug.find().exec(function(error, drugs){
              if(error) res.send(error);
              if(drugs){
                  res.send(drugs);
              }
            });
        }else {

            res.forbidden({'forbidden':'Access Denied'});

        }


      }
    }else{
      res.forbidden({'forbidden':'Access Denied'});
    }

  },
  
};

