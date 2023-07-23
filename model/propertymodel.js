const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  imageUrl: String,
  name: String,
  location: String,
  property_type: String,
  description: String,
  price: Number,
  rating: Number,
  hostId: String
});

const Property = mongoose.model('Property', propertySchema);

module.exports = {
  Property
}