const express = require("express");
const {
  PermissionMiddlewareCreator,
  RecordCreator,
  RecordUpdater,
} = require("forest-express-mongoose");
const { tomes } = require("../models");

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator("tomes");

// This file contains the logic of every route in Forest Admin for the collection tomes:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Tome
router.post(
  "/tomes",

  permissionMiddlewareCreator.create(),
  (request, response, next) => {
    const recordCreator = new RecordCreator(tomes);
    recordCreator
      .deserialize(request.body)
      .then(async (recordToCreate) => {
        if (recordToCreate.image) {
          const result = await cloudinary.uploader.upload(recordToCreate.image);
          recordToCreate.image = result.secure_url;
          // console.log(recordCreator.image);
        }
        if (recordToCreate.video) {
          // console.log(recordToCreate, "🔥🔥🔥🔥🔥🔥🔥🔥🔥");
          const result = await cloudinary.uploader.upload_large(
            recordToCreate.video,
            { resource_type: "video" }
          );
          // console.log(result);
          recordToCreate.video = result.secure_url;
        }
        // console.log(recordToCreate);
        return recordCreator.create(recordToCreate);
      })
      .then((record) => recordCreator.serialize(record))
      .then((recordSerialized) => response.send(recordSerialized))
      .catch(next);
  }

  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
);

// Update a Tome
router.put(
  "/tomes/:recordId",
  permissionMiddlewareCreator.update(),
  (request, response, next) => {
    // console.log(request.body);
    const recordUpdater = new RecordUpdater(tomes);
    recordUpdater
      .deserialize(request.body)
      .then(async (recordToUpdate) => {
        if (recordToUpdate.image) {
          const result = await cloudinary.uploader.upload(recordToUpdate.image);
          recordToUpdate.image = result.secure_url;
          console.log(recordToUpdate);
        }
        if (recordToUpdate.video) {
          const result = await cloudinary.uploader.upload_large(
            recordToUpdate.video,
            { resource_type: "video" }
          );
        }
        console.log(recordToUpdate);

        return recordUpdater.update(recordToUpdate, request.params.recordId);
      })
      .then((record) => recordUpdater.serialize(record))
      .then((recordSerialized) => response.send(recordSerialized))
      .catch(next);

    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  }
);

// Delete a Tome
router.delete(
  "/tomes/:recordId",
  permissionMiddlewareCreator.delete(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
    next();
  }
);

// Get a list of Tomes
router.get(
  "/tomes",
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
    next();
  }
);

// Get a number of Tomes
router.get(
  "/tomes/count",
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
    // Improve peformances disabling pagination: https://docs.forestadmin.com/documentation/reference-guide/performance#disable-pagination-count
    next();
  }
);

// Get a Tome
router.get(
  "/tomes/\\b(?!count\\b):recordId",
  permissionMiddlewareCreator.details(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
    next();
  }
);

// Export a list of Tomes
router.get(
  "/tomes.csv",
  permissionMiddlewareCreator.export(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
    next();
  }
);

// Delete a list of Tomes
router.delete(
  "/tomes",
  permissionMiddlewareCreator.delete(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
    next();
  }
);

module.exports = router;
