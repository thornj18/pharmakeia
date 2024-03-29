/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    if (req.params.all('imei')) {
      Device.findOne({
        imei: req.param('imei')
      }).exec(function (err, device) {

		  if(err){
			  res.send({"error":err});
		  }
        if (!device) {
          Device.create({
            imei: req.param('imei')
          }).exec(function (err, created) {
            if (created) {
              res.send({
                "created": created
              });
            }
          });
        }else{
			res.send({"created":device});
		}
      })


    } else {
      res.forbidden({
        'forbidden': 'Access Denied'
      });
    }

  },
  get: function (req, res) {
    if (req.params.all('imei')) {
      Device.findOne({
        imei: req.param('imei')
      }).exec(function (err, device) {
        if (device) {
          res.send(device);
        } else {
          res.send(404);
        }
      });
    } else {
      res.forbidden({
        'forbidden': 'Access Denied'
      });
    }
  }
};
