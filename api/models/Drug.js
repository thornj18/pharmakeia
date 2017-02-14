/**
 * Drug.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    brand_name:{
      type:"string",
      required:true
    },

    generic_name:{
      type:"string",
      required:true

    },

    indications:{
      type:"string",
      required:true
    },

    contraindications:{
      type:"string",
      required:true
    },

    storage:{
      type:"string",
      required:true
    },

    caution:{
      type:"string",
      required:true
    },

    price:{
      type:"string",
      // required:true
    },

    prescription:{
      type:"string"
    },

    owners:{
      collection:"Pharmacy",
      via:"drugs",
      required:true,
    }


  }
};

