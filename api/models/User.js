var bcrypt = require('bcryptjs');

/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{
          type:"string",
          required: true
      },
      email:{
          type:"email",
          required:true
      },
      password:{
          type:"string",
          required:true
      },
      phone:{
          type:"string",
          required:true
      },

      access_token:{
          type:"string"

      },
      
      location:{
        type:"string"

      },

      orders:{
        collection:"order",
        via:"to_user"
      },
      
      device:{
        collection:"device",
        via:"owner"
      },

      role:{
        model:"role"
      }



  },


beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    },

    
    afterCreate: function(user, next){
        Role.findOrCreate({name:'subscriber'},{name:'subscriber'}).exec(function(error, role){
          if (error) {
              
            return error;
          }
          if(role){
            User.update({id:user.id},{role:role}).exec(function(error,updated){
              if (error) {
                return error;
              }else{
                return updated;
              }
              return next;
            });
          }
        });
    }

    
};
