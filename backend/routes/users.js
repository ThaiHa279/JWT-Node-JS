const middlewareController = require("../controller/middlewareController");
const userController = require("../controller/userController");

const router = require("express").Router();

// Get all users
router.get("/",middlewareController.verifyToken, userController.getAllUsers);
router.delete("/:id", middlewareController.verifyDelete,userController.deleteUser);

module.exports = router;