const express = require('express');
const guestrouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Guest } = require('../model/guestmodel');
const { authenticate } = require('../middlewares/authentication');
require("dotenv").config();

// Route for creating a new host
// console.log("1")
guestrouter.post('/register', async (req, res) => {

    const { name, email, password, gender, date_of_birth, bio } = req.body;
    // console.log(req.body)
    let find_email = await Guest.find({ email });
    if (find_email.length > 0) {
        return res.json({ msg: "Email Already Exists" })
    }
    try {
        bcrypt.hash(password, 4, async (err, secure_password) => {
            if (err) {
                console.log(err)
            } else {
                const host_data = new Guest({ name, email, password: secure_password, gender, date_of_birth, bio });
                await host_data.save();
                res.json({ "msg": "Guest registered Successfully" })
            }
        })
    } catch (error) {

        res.status(500).json({ error: 'Error creating Guest' });
    }


});

// Route for host login
// console.log("2")
guestrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user_data = await Guest.find({ email: email });
        //   console.log(user_data);
        const hashed_password = user_data[0].password;
        if (user_data.length > 0) {
            bcrypt.compare(password, hashed_password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user_data[0]._id }, process.env.key);
                    // console.log(token);
                    res.status(201).json({ "msg": "User Successfully LoggedIn", "token": token, "guestID": user_data[0]._id});
                } else {
                    res.json({ msg: "Wrong Credentials" });
                }
            });
        }
    } catch (error) {
        res.json({ msg: "Error in Logging the user" });
        console.log(error);
    }
});


guestrouter.get('/get_guests', async (req, res) => {
    try {
        const guests = await Guest.find({}, { password: 0 }); // Exclude the password from the response
        res.json(guests);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching guests' });
    }
});


guestrouter.use(authenticate);
// console.log("3")
// Route for getting all hosts

// console.log("4")
// Route for getting a specific host by ID
guestrouter.get('/get_guests/:id', async (req, res) => {
    try {
        const host = await Guest.findById(req.params.id, { password: 0 }); // Exclude the password from the response

        if (!host) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        res.json(host);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching guest' });
    }
});
// console.log("5")
// Route for updating a host by ID
guestrouter.put('/update_guests/:id', async (req, res) => {
    try {
        const { name, email, password, gender, date_of_birth, bio } = req.body;

        const host = await Guest.findByIdAndUpdate(req.params.id, {
            name,
            email,
            password,
            gender,
            date_of_birth,
            bio
        }, { new: true });

        if (!host) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        res.json({ message: 'Guest updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating guest' });
    }
});
// console.log("6")
// Route for deleting a host by ID
guestrouter.delete('/del_guests/:id', async (req, res) => {
    try {
        const host = await Guest.findByIdAndDelete(req.params.id);

        if (!host) {
            return res.status(404).json({ message: 'Guest not found' });
        }

        res.json({ message: 'Guest deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting host' });
    }
});

module.exports = { guestrouter };

// {
//     "name":"nikhil",
//     "password":"nikhil",
//     "email":"nikhil@gmail.com",
//     "hostStatus":"available",
//     "location":"new_delhi",
//     "propertyType":"vacation",
//     "about":"Guptas Manison",
//     "hostingSince":1990
//   }
