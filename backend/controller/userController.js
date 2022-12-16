const User = require("../models/User")

const userController = {
    // get all users
    getAllUsers: async(req, res) => {
        try {
            const users = await User.find(); 
            res.status(200).json(users);
        }catch(err) {
            return res.status(500).json(err);
        }
    }, 
    // delete user
    deleteUser: async(req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete successfully");
        }catch(err) {
            return res.status(500).json(err);
        }
    }
}

module.exports = userController