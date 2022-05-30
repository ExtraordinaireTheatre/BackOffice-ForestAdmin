const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const router = express.Router();
const formidable = require("express-formidable");

const { users } = require("../models");

router.post("/user/signup", async (req, res) => {
  try {
    const alreadyMail = await users.findOne({ email: req.body.email });
    const alreadyUsername = await users.findOne({
      account: { username: req.body.username },
    });
    if (alreadyMail) return res.status(400).json("This mail already exist");
    else if (req.body.email.indexOf("@") === -1)
      return res.status(400).json("This mail is invalid");
    else if (alreadyUsername || req.body.username === undefined)
      return res.status(400).json("This username already exist or is missing");
    else {
      const salt = uid2(32);
      const hash = SHA256(req.body.password + salt).toString(encBase64);
      const token = uid2(32);

      console.log(req.body.expoToken);

      const newAccount = new users({
        email: req.body.email,
        account: {
          username: req.body.username,
        },
        newsletter: req.body.newsletter,
        token: token,
        hash: hash,
        salt: salt,
        // expoToken: req.body.expoToken,
      });
      if (req.body.expoToken) {
        newAccount.expoToken = req.body.expoToken;
      }

      console.log(newAccount);
      await newAccount.save();
      const ret = {
        _id: newAccount._id,
        token: newAccount.token,
        account: {
          username: newAccount.account.username,
          statut: "Sign up successful",
        },
      };
      return res.status(200).json(ret);
    }
  } catch (error) {
    return res.status(400).json({ error: { message: error.message } });
  }
});

router.post("/user/login/", async (req, res) => {
  // console.log(req.body)
  try {
    const goodUser = await users.findOne({ email: req.body.email });
    if (!goodUser) return res.status(401).json("Unauthorized !");
    else {
      const decrypt = SHA256(req.body.password + goodUser.salt).toString(
        encBase64
      );
      if (decrypt === goodUser.hash) {
        const ret = {
          _id: goodUser._id,
          token: goodUser.token,
          account: {
            username: goodUser.account.username,
            state: "Connect with success",
          },
        };
        return res.status(200).json(ret);
      } else {
        return res.status(401).json("Unauthorized !");
      }
    }
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.get("/notification", async (req, res) => {
  try {
    const listUser = await users.find();
    // .select("token -_id");
    const arraySubscribed = [];

    listUser.map((item) => {
      if (item.expoToken) {
        arraySubscribed.push(item.expoToken);
      }
    });

    res.json(arraySubscribed);
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = router;
