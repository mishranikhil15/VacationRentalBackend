const mongoose=require('mongoose')

const bookingSchema =  mongoose.Schema({
    property_id: {type:"ObjectId",ref:"Property"},
    guest_id: {type:"ObjectId",ref:"Guest"},
    check_in_date: String,
    check_out_date: String,
  });
  
  const Booking = mongoose.model('Booking', bookingSchema);

  module.exports={
    Booking
  }