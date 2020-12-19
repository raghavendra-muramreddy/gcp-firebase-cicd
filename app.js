var admin = require("firebase-admin");

var serviceAccount = require("./api-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://playground-s-11-1756c3f9-default-rtdb.firebaseio.com/"
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }


  files.forEach(function(file) {
    var lastDotIndex = file.lastIndexOf(".");
  
    var menu = require("./files/" + file);

    menu.forEach(function(obj) {
      var collectonName=file.substring(0, lastDotIndex);
      console.log("collection Name:"+collectonName);
          firestore
        .collection(collectonName)
        .doc(obj.itemID)
        .set(obj)
        .then(function(docRef) {
          console.log("Document written");
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    });
  });
});
