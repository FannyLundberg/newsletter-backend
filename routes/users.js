var express = require('express');
var router = express.Router();

const { ObjectId } = require('mongodb');

// Kontrollera om användarnamn och lösenord stämmer överens 
router.post("/", (req, res) => {

  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
    console.log(results);

    let existingUser = results.find((user) => {
      return user.username == req.body.username && user.password == req.body.password
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


// Lägga till en ny användare
router.post("/newuser", (req, res) => {

  req.app.locals.db.collection("users").insertOne(req.body)
  .then(result => {
    console.log(result);

    res.json({ "message": "success" })
  })
})


// Hämta alla användare
router.get("/", (req, res) => {

  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
    console.log(results)
    
    res.json({ "message": "success", "resultat": results })
  })
});


// Starta prenumeration
router.post("/subscribe", (req, res) => {

  console.log("req.body.userID: " + req.body._id)

  req.app.locals.db.collection("users").updateOne({"_id": ObjectId(req.body._id)}, {$set: {"email": req.body.email, "subscriber": true}})
  .then(result => {
    console.log(result);

    res.json({ "message": "success" })
  })
})

module.exports = router;
