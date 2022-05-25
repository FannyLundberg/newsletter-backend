var express = require('express');
var router = express.Router();
var CryptoJS = require("crypto-js");

const { ObjectId } = require('mongodb');

// Kontrollera om användarnamn och lösenord stämmer överens 
router.post("/", (req, res) => {

  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
    console.log(results);

    let existingUser = results.find((user) => {

      let decrypted = CryptoJS.AES.decrypt(user.password, "macarena").toString(CryptoJS.enc.Utf8)

      return user.username == req.body.username && decrypted == req.body.password
    })

    // Om användaren har angett rätt och matchande uppgifter
    // Skicka med användarens id
    if(existingUser) {
      return res.json({ "message": "success", "userId": existingUser._id, "subscriber": existingUser.subscriber })

    // Om fel uppgifter: error
    } else {
      res.json({ "message": "error" })
    }
  });
});


// Se om användaren är en prenumerant 
router.post("/subscription", (req, res) => {

  req.app.locals.db.collection("users").find().toArray()
  .then(results => {

    let isUserSubscriber = results.find((userSubscriber) => {

      return userSubscriber._id == req.body._id 
    })

    if(isUserSubscriber) {
      return res.json({ "message": "success", "subscriber": isUserSubscriber.subscriber })

    } else {
      res.json({ "message": "error" })
    }

    console.log(results);
  });
});


// Lägga till en ny användare
router.post("/newuser", (req, res) => {

  // Kryptering av lösenord
  req.body.password = CryptoJS.AES.encrypt(req.body.password, "macarena").toString();

  req.app.locals.db.collection("users").insertOne(req.body)
  .then(result => {
    console.log(result);

    res.json({ "message": "success" })
  })
})


// // Hämta alla användare
// router.get("/", (req, res) => {

//   req.app.locals.db.collection("users").find().toArray()
//   .then(results => {
//     console.log(results)
    
//     res.json({ "message": "success", "resultat": results })
//   })
// });


// Starta prenumeration
router.post("/subscribe", (req, res) => {

  console.log("req.body.userID: " + req.body._id)

  req.app.locals.db.collection("users").updateOne({"_id": ObjectId(req.body._id)}, {$set: {"subscriber": true}})
  .then(result => {
    console.log(result);

    res.json({ "message": "success" })
  })
})


// Avbryt prenumeration
router.post("/unsubscribe", (req, res) => {

  console.log("req.body.userID: " + req.body._id)

  req.app.locals.db.collection("users").updateOne({"_id": ObjectId(req.body._id)}, {$set: {"subscriber": false}})
  .then(result => {
    console.log(result);

    res.json({ "message": "success" })
  })
})

module.exports = router;
