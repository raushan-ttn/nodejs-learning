const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// In some special cases, we of course can create other endpoints-
// that do not 100 % fit that REST philosophy/architecture.

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protectTours, authController.updatePassword);
router.patch('/updateMe', authController.protectTours, userController.updateMe);
router.delete('/deleteMe', authController.protectTours, userController.deleteMe);

// User API's
router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
