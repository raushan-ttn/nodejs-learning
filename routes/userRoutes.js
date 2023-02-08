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
router.patch('/updateMe', authController.protectTours, userController.uploadUserPhoto, userController.updateMe);
router.delete('/deleteMe', authController.protectTours, userController.deleteMe);

// MIDDLEWARE RUN in Sequence, so before defined route will be run as anonymous.
// But after this middleware route will automatically check loggedIn condition.
// That's a nice little trick in order to protect all of the routes at the same time,-
// typically by using a middleware that comes before all these other routes.

router.use(authController.protectTours);

// Get /me
router.get('/me', userController.getMe, userController.getSingleUser);

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
