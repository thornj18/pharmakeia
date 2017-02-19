var bcrypt = require('bcryptjs');


/**
 * Pharmacy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    name:{
      type:"string",
      required:true

    },

    owners_name:{
      type:"string",
      required:true
    },

    email:{
      type:"email",
      required:true
    },

    location:{
      type:"string",
      required:true
    },

    latitude:{
      type:"string",
      required:true
    },

    longitude:{
      type:"string",
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

    country:{
      type:"string",
      required:true
    },

    opening_hours:{
      type:"string",
      required:true
    },

    closing_hours:{
      type:"string",
      required:true
    },

    city:{
      type:"string",
      required:true

    },

    pharmacy_reg_number:{
      type:"string",
      required:true
    },



    drugs:{
      collection:"drug",
      via:"owners",
      through:'drugpharmacy'
    },

    orders:{
      collection:"order",
      via:"from_pharmacy"
    },

     role:{
        model:"role"
      }

  },

  beforeCreate: function(Pharmacy, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(Pharmacy.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    Pharmacy.password = hash;
                    cb();
                }
            });
        });
    },

    afterCreate: function(Pharmacy, next){
        Role.findOrCreate({name:'pharmacy-admin'},{name:'pharmacy-admin'}).exec(function(error, role){
          if(role){
            sails.models['pharmacy'].update({id:Pharmacy.id},{role:role}).exec(function(err, updated){
              if (error) {
                return error;
              }
              return next;
            });
          }
        });
    }


};
