const express = require('express'); 
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParse = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');

dotenv.config();
const app = express()

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('Connected to MongoDB');
});

app.use(cors());
app.use(cookieParser()); 
app.use(express.json());


// Route 
app.use("/v1/auth",authRoute);
app.use("/v1/user",userRoute);

app.listen(8000 , () => {
    console.log('Server is runnning');
})