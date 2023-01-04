const express = require("express");
const userController = require("./../controllers/userController");
const router = express.Router();

// User API's
router
  .route("/")
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
