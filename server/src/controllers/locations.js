const mongoose = require('mongoose');
// Models
const Location = require('../models/locations');


class LocationController {
    /**
     * Login into grassServices.
     *
     * @param {object} formData Login Information
     * @returns {object} Login Result
     */
    static async addLocation(user, formData) {
        if (!user) {
            throw (new Error('User is needed in order to add location'));
          } 

        const location = new Location(formData);
        location.userId = mongoose.Types.ObjectId(user._id)
        await location.save();
        return (location);

    }

    static async getLocations(user) {
      //  TODO: RETURN ALL LOCATIONS 
        if (!user) {
            throw (new Error('User is needed in order to add location'));
          } 
        const locations = await Location.find({ userId: mongoose.Types.ObjectId(user._id) });
        return (locations);
    }

    static async updateLocation(user, formData) {
        if (!user) {
            throw (new Error('User is needed in order to update location'));
          } 
        
        let locations = await User.findOne({ userId: user._id });
  

        const location = new Location(formData);
        await location.save();
        return (location);

    }
}

module.exports = LocationController