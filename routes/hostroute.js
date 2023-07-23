const express = require('express');
const hostrouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Host } = require('../model/hostmodel');
const { authenticate } = require('../middlewares/authentication');
require("dotenv").config();

// Route for creating a new host
// console.log("1")
hostrouter.post('/register', async (req, res) => {
  
    const { name, password,email, hostStatus, location, propertyType, about, hostingSince } = req.body;
    // console.log(req.body)
    let find_email=await Host.find({email});
    if(find_email.length>0){
        return res.json({msg:"Email Already Exists"})
    }
   try {
    bcrypt.hash(password,4,async(err,secure_password)=>{
        if(err){
            console.log(err)
        }else{
            const host_data= new Host({name, password:secure_password,email, hostStatus, location, propertyType, about, hostingSince});
            await host_data.save();
            res.json({"msg":"Host registered Successfully"})
        }
    })
   } catch (error) {
    
       res.status(500).json({ error: 'Error creating host' });
   }
   

});

// Route for host login
// console.log("2")
hostrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      let user_data = await Host.find({ email: email });
      //   console.log(user_data);
      const hashed_password = user_data[0].password;
      if (user_data.length > 0) {
        bcrypt.compare(password, hashed_password, (err, result) => {
          if (result) {
            const token = jwt.sign({ userID: user_data[0]._id }, process.env.key);
            // console.log(token);
            res.status(201).json({"msg":"User Successfully LoggedIn","token":token,"userID": user_data[0]._id});
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

// Middleware for authenticating requests
hostrouter.get('/get_hosts', async (req, res) => {
    try {
      const hosts = await Host.find({}, { password: 0 }); // Exclude the password from the response
      res.json(hosts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching hosts' });
    }
  });


hostrouter.use(authenticate);
// console.log("3")
// Route for getting all hosts

// console.log("4")
// Route for getting a specific host by ID
hostrouter.get('/get_hosts/:id', async (req, res) => {
  try {
    const host = await Host.findById(req.params.id, { password: 0 }); // Exclude the password from the response

    if (!host) {  
      return res.status(404).json({ message: 'Host not found' });
    }

    res.json(host);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching host' });
  }
});
// console.log("5")
// Route for updating a host by ID
hostrouter.put('/update_hosts/:id', async (req, res) => {
  try {
    const { name, hostStatus, location, propertyType, about, hostingSince } = req.body;

    const host = await Host.findByIdAndUpdate(req.params.id, {
      name,
      hostStatus,
      location,
      propertyType,
      about,
      hostingSince,
    }, { new: true });

    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    res.json({ message: 'Host updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating host' });
  }
});
// console.log("6")
// Route for deleting a host by ID
hostrouter.delete('/del_hosts/:id', async (req, res) => {
  try {
    const host = await Host.findByIdAndDelete(req.params.id);

    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    res.json({ message: 'Host deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting host' });
  }
});

module.exports = {hostrouter};

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
 