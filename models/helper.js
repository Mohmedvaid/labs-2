let locationDB = require("./Locations");

function validateUserLocation(userLocation) {
	console.log(userLocation);
  if (this.userType === "admin") return true;
  return locationDB
    .find({ name: userLocation })
    .then((dbLocations) => {
      console.log("dblocations", dbLocations);
      if (
        dbLocations.length === 0 ||
        dbLocations.length !== userLocation.length
      )
        return false;
      let tempLocations = [...dbLocations];
      dbLocations.forEach((dbLocation) => {
        tempLocations.splice(tempLocations.indexOf(dbLocation.name), 1);
      });

      if (tempLocations.length === 0) return true;
      return false;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}
function validateCustomerLocation(customerLocation) {
  return locationDB
    .findOne({ name: customerLocation })
    .then((dbLocations) => {
      if (!dbLocations) return false;
      else if (dbLocations.name !== customerLocation) return false;
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}
module.exports = {
  validateLocation: validateUserLocation,
  validateCustomerLocation,
};
