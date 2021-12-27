const router = require('express').Router();
const customerDB = require('../models/Customers');
const Monoose = require('mongoose');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images'];

router.post('/api/customer', ({ body }, res) => {
  let customer = {
    firstName: body.firstname,
    lastName: body.lastname,
    email: body.email,
    address: body.address,
    location: body.location,
    image: body.idImage,
    dob: body.dob,
    customerSignature: body.customerSignature,
  };
  console.log(customer);
  // return res.json("done")
  return customerDB
    .find({ email: customer.email })
    .then((dup_key) => {
      if (dup_key.length !== 0) throw { error: 'Duplicate email', message: 'Email already added' };
      return;
    })
    .then(() => new customerDB(customer))
    .then((newCustomer) => {
		if(newCustomer.image) return saveImage(newCustomer, customer.image);
		return newCustomer;
	})
    .then((newCustomer) => newCustomer.save())
    .then((newCustomer) => res.json(newCustomer))
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.get('/api/customer', (req, res) => {
  let location = req.cookies.location;
  if (location === undefined) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (location.toLowerCase() === 'all') {
    location = {};
  } else {
    location = { location: location.toLowerCase() };
  }
  customerDB
    .find(location)
    .then((customer) => {
      return res.json(customer);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});
router.get('/api/customer/:id', (req, res) => {
  //let location = req.cookies.location
  customerDB
    .findOne({ _id: req.params.id })
    .then((customer) => {
      return res.json(customer);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.put('/api/customer/:id', (req, res) => {
  let id = req.params.id;
  customerDB
    .findOneAndUpdate({ _id: id }, { $push: { exercises: req.body } }, { new: true })
    .then((dbWorkout) => {
      console.log(dbWorkout);
      function totalDuration() {
        let totalDuration = 0;
        dbWorkout.exercises.forEach((exercise) => {
          totalDuration += exercise.duration;
          return totalDuration;
        });
        customerDB.findOneAndUpdate({ _id: id }, { totalDuration: totalDuration }).then((updatedWorkout) => {
          res.json(updatedWorkout);
        });
        // dbWorkout.totalDuration = totalDuration;
        // console.log("dbWorkout Duration in the func: "+ dbWorkout.totalDuration);
      }

      totalDuration();
      // console.log(dbWorkout)
      // .then(res.json(dbWorkout))
    })

    .catch((err) => {
      res.json(err);
    });
});

function saveImage(customer, encodedImage) {
  if (encodedImage === undefined || encodedImage === null) {
    throw { error: 'Image is required' };
  }
  const image = JSON.parse(encodedImage);
  if (image != null || imageMimeTypes.includes(image.type)) {
  }
  customer.image = new Buffer.from(image.data, 'base64');
  customer.imageType = image.type;
  return customer;
}

module.exports = router;
