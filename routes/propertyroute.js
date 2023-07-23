const express = require('express');
const propertyrouter = express.Router();
const { Property } = require('../model/propertymodel');
const { authenticate } = require('../middlewares/authentication');
const { authorise } = require('../middlewares/authorization');



// Route for creating a new property for a specific host
propertyrouter.post('/properties', authenticate, async (req, res) => {
    try {
        const { imageUrl, name, location, property_type, description, price, rating } = req.body;
        const property = await Property.create({
            imageUrl,
            name,
            location,
            property_type,
            description,
            price,
            rating,
            hostId: req.body.userID,
        });
        // console.log(req.body.userID)  

        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        res.status(500).json({ error: 'Error creating property' });
    }
});

propertyrouter.get("/", async (req, res) => {

    try {
        let all_properties = await Property.find();
        res.json({ "msg": all_properties });
    } catch (error) {
        console.log("error");
        res.json({ "msg": "Error while getting the property details" })
    }
})

propertyrouter.get("/own_property/:userId", authenticate, async (req, res) => {

    let hostId = req.body.userID;
    let id = req.params.userId
    //  console.log(id);

    try {
        let all_properties = await Property.find({ hostId: id });
        // console.log(all_properties)
        res.json({ "msg": all_properties });
    } catch (error) {
        console.log("error");
        res.json({ "msg": "Error while getting the property details" })
    }
})

propertyrouter.put("/edit_property/:id", authenticate, async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    const find_property = await Property.find({ _id: id });
    //    console.log(find_property);
    const database_hostId = find_property[0].hostId;
    const hostId = req.body.userID;
    //    console.log(database_hostId,hostId)

    try {
        if (database_hostId == hostId) {
            await Property.findByIdAndUpdate({ "_id": id }, payload);
            res.json({ "msg": "Updated the property details" })
        } else {
            res.json({ "msg": "You are not authorized" });
        }
    } catch (error) {
        console.log("Error");
        res.json({ "msg": "Error while updating the property" })
    }
})

propertyrouter.delete("/del_property/:id", authenticate, async (req, res) => {

    const id = req.params.id;
    const find_property = await Property.find({ _id: id });
    //    console.log(find_property);
    const database_hostId = find_property[0].hostId;
    const hostId = req.body.userID;
    //    console.log(database_hostId,hostId)

    try {
        if (database_hostId == hostId) {
            await Property.findByIdAndDelete({ "_id": id });
            res.json({ "msg": "Deleted the property details" })
        } else {
            res.json({ "msg": "You are not authorized" });
        }
    } catch (error) {
        console.log("Error");
        res.json({ "msg": "Error while deleting the property" })
    }
})

//// sorting

propertyrouter.get("/sort", async (req, res) => {
    const query = req.query.value
    try {
        if (query == "asc") {
            let sort_data = await Property.find().sort({ price: 1 });
            res.json({ "msg": sort_data })
        } else if (query == "desc") {
            let sort_data = await Property.find().sort({ price: -1 });
            res.json({ "msg": sort_data })
        }
    } catch (error) {
        res.json({ "msg": "Error while sorting the data" })
    }
})

//// filter

propertyrouter.get("/filter", async (req, res) => {
    const location = req.query.value;
    // console.log(location)
    const query = {};
    try {
        if (query != undefined) {
            query.location = { '$regex': location, '$options': "i" }
        //   console.log(query)
        }
        let filt_data = await Property.find(query);
        res.json({ "msg": filt_data })
    } catch (error) {
        res.json({ "msg": "Error while filtering the data" })
    }
})

/// pagination

propertyrouter.get("/pagination",async(req,res)=>{ 
    const limit=req.query.limit||0;
    const page_no=req.query.page||1;
    // console.log(limit,page_no)
    try {
       let paginate_data=await Property.find().skip((page_no-1)*limit).limit(limit);
       res.json(paginate_data); 
    } catch (error) {
        console.log(error);
        res.json({"msg":"Error while doing the Pagination"})
    }
})


module.exports = { propertyrouter };


// {
//     "name":"nikhil",
//     "location":"lucknow",
//     "property_type":"vacation",
//     "description":"Home Stay Properties",
//     "price":1000,
//     "rating":4.4
//   }