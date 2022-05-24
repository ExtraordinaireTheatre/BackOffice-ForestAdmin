const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
// const books = require("../Tales.json");
// app.use(express.json())

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const { tomes } = require("../models");

router.post("/tome/add", async (req, res) => {
  try {
    const { title, image, tome } = req.fields;
    const newTome = new tomes({
      title: title,
      image: image,
      tome: tome,
    });
    // console.log(newTome);
    await newTome.save();
    return res.status(200).json(newTome);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.get("/tome", async (req, res) => {
  try {
    // const filter = {};
    // if (req.query.title){
    //     filter.title = new RegExp(req.query.title, "i");
    // }
    const tale = await tomes.find();
    return res.status(200).json(tale);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
