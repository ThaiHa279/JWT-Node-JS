const User = require("../models/User");
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

let refreshTokens = [];
const authController = {
    // register
    registerUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.passWord, salt);
           
            // Create a new user
            const newUser = await new User ({
                userName: req.body.userName,
                email: req.body.email,
                passWord: hashed, 
            });
            // Save to DB
            const user = await newUser.save(); 
            res.status(200).json(user);
        }
        catch(err) {
            res.status(500).json(err);
        }
    },
    // generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            {expiresIn: "30s"}
        )
    }, 
    generateRefreshToken: (user) => {
        return jwt.sign({
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            {expiresIn: "1d"}
        )
    }, 
    
    // Login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ userName: req.body.userName });
            if (!user) {
                return res.status(404).json("Wrong username");
            } 
            const validPassword = await bcrypt.compare(req.body.passWord, user.passWord); 
            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }
            if (validPassword && user) {
                const accesstToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true, 
                    secure: false, 
                    path: "/", 
                    sameSite: "strict"
                });
                const {passWord, ...others} = user._doc;
                res.status(200).json({...others, accesstToken});
            }
        }catch(err) {
            return res.status(500).json(err);
        }
    },
    // refreshToken
    requestRefreshToken: async(req, res) => {
        // take refresh token
        const refreshToken = req.cookies.refreshToken; 
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        // check token validity
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY , (err, user) => {
            if (err) return res.status(500).json(err);
            refreshTokens = refreshTokens.filter((token) => token !== refreshTokens)
            // create new token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true, 
                secure: false, 
                path: "/", 
                sameSite: "strict"
            });
            res.status(200).json({accesstToken: newAccessToken});
        })
    }, 
    userLogout: (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out!");
    },     

}; 

//

module.exports = authController;