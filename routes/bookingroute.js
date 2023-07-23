const express = require('express');
const bookingrouter = express.Router();
const { Booking } = require('../model/bookingmodel');
const { authenticate } = require('../middlewares/authentication');



// Route for creating a new booking
bookingrouter.post('/bookings',authenticate, async (req, res) => {
  try {
    const { property_id, guest_id, check_in_date, check_out_date } = req.body;

    // Check if the property and guest exist in the database before creating the booking
    // You can implement this check here

    

    const booking = new Booking({
      property_id,
      guest_id,
      check_in_date,
      check_out_date,
    });
    await booking.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error creating booking' });
  }
});



// Route for getting all bookings made by a specific guest
bookingrouter.get('/bookings/guest/:guestId', async (req, res) => {
  try {
    const guest_id = req.params.guestId;
    const bookings = await Booking.find({ guest_id }).populate("property_id").populate("guest_id");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching guest bookings' });
  }
});

// // Route for getting all bookings for a specific property
// bookingrouter.get('/bookings/property/:propertyId', async (req, res) => {
//   try {
//     const property_id = req.params.propertyId;
//     const bookings = await Booking.find({ property_id });
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching property bookings' });
//   }
// });




// Route for deleting a booking by ID
bookingrouter.delete('/bookings/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
});

module.exports = {bookingrouter};
