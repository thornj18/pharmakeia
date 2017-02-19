/**
 * Order.js
 *
  * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    to_user:{
      model:"user"
    },

    from_pharmacy:{
      model:"pharmacy"
    },

    drug:{
      model:"drug"
    },

    status:{
      type:"string",
      required:true
    }

  }
};

