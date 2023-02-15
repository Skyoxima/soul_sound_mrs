// Required Packages
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Mongoose Setup
// 1. Mongoose Connection
mongoose.connect('mongodb+srv://abc123:mongodb@mycluster.ejia9i8.mongodb.net/soulsound-music', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 2. Define Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    gender: String,
    age: Number
});

// 3. Define a model for user
const User = mongoose.model('User', userSchema);

// Route setup
app.post('/signup', (req, res) => {
    const { username, password, gender, age } = req.body.user;
    
    // Create Instance
    const user = new User({
        username: username,
        password: password,
        gender: gender,
        age: age
    });
    // Save data
    user.save((error) => {
        if (error)
            return res.status(500).send(error);
        return res.status(200);
    })
});

// Server setup
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});