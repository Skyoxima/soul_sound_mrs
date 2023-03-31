// Required Packages
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
require('dotenv').config();
// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Mongoose Setup
// 1. Mongoose Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_ENDPOINT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 2. Define Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    gender: String,
    age: Number
});

// 3. Define a model for user
const User = mongoose.model('User', userSchema);

// Route setup
app.post('/signup', async (req, res) => {
    const { username, email, password, gender, age } = req.body.user;
    User.countDocuments({ email: email }, function (err, count) {
        if (count > 1) {
            return res.status(500).send({message: "User already exists."});
        }
        else {
            // Create Instance
            const user = new User({
                username: username,
                email: email,
                password: password,
                gender: gender,
                age: age
            });
            // Save data
            user.save((error) => {
                if (error)
                    return res.status(500).send({ message: error });
                return res.status(200).send({ message: "User Details stored successfully" });
            })
        }
    });
});


app.post("/login", (req, res) => {
    const { email, password } = req.body.userLogin;
    User.findOne({ email: email }, (err, userExists) => {
        if (userExists && userExists.password === password) {
            return res.send({ message: "Login Success", userDeets: userExists });
        }
        return res.send({ message: "Error Occured" });
    })
})

// Server setup
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});