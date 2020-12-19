var admin = require("firebase-admin");

var serviceAccount = require("./api-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://playground-s-11-496b5d7e-default-rtdb.firebaseio.com/"
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "data");



function deleteDoc(docRef) {
  return docRef.delete();

}


async function getDocList(collectionObj) {
  var docListPromise = firestore.collection(collectionObj.path).listDocuments();

  let docList = await docListPromise;
  deletedDocsList=[];
  for (doc in docList) {
    deletedDocsList.push(await deleteDoc(docList[doc]));

  }
  return deletedDocsList;

}

async function deleteCollectionIfExists(collectionName) {
  var collectionsRef = firestore.collection(collectionName);

  if (collectionsRef != null) {
    return await getDocList(collectionsRef);
  } else {
    console.log(collectionName + " collection Not found");
    return "";
  }
  
}

async function process() {
  console.log("****************process start***************");
  await readCollectionPath();
  
}


async function readCollectionPath() {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    } else {
      saveCollection(files).then(collectionsList => {
        console.log("total saved collections:" + collectionsList.length);
        console.log("****************process end***************");
      });

    }

  });
}
async function saveCollection(files) {
  for (fileIndex in files) {
    var file = files[fileIndex];
    var lastDotIndex = file.lastIndexOf(".");
    var collectonName = file.substring(0, lastDotIndex);
    await deleteCollectionIfExists(collectonName);
    var menu = require("./data/" + file);
    var savedcollectionsRef = []
    for (menuIndex in menu) {
      var obj = menu[menuIndex];
      var collectonName = file.substring(0, lastDotIndex);
      var docRef = await firestore.collection(collectonName).doc(obj.itemID).set(obj);
      savedcollectionsRef.push(await docRef);
    }
    return savedcollectionsRef;

  }
}

process();

