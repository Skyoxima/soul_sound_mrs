// Required Packages
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require("cors");
const csvtojson = require('csvtojson');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
require('dotenv').config();
// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Spotify Setup
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

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
    age: Number,
    // listeningActivity: String
    listeningActivity: {
        type: Array,
        default: []
    }
});

const musicSchema = new mongoose.Schema({
    track_id: String,
    track_name: String,
    duration: Number,
    primary_artists: String,
    language: String,
    track_url: String,
    track_image: String,
    download_url: String,
    spotify_track_id: String,
    acousticness: Number,
    danceability: Number,
    duration_ms: Number,
    energy: Number,
    instrumentalness: Number,
    key: Number,
    liveness: Number,
    loudness: Number,
    mode: Number,
    speechiness: Number,
    tempo: Number,
    time_signature: Number,
    valence: Number,
    play_count: Number
})


// 3. Define a model for user
const User = mongoose.model('User', userSchema, 'users');
const Music = mongoose.model('Music', musicSchema, 'music');

// Route setup
app.post('/signup', async (req, res) => {
    const { username, email, password, gender, age } = req.body.user;
    User.findOne({ email: email }, function (err, emailExists) {
        if (emailExists) {
            return res.status(500).send({ message: "User already exists. Please Login" });
        }
        else {
            // Create Instance
            const user = new User({
                username: username,
                email: email,
                password: password,
                gender: gender,
                age: age,
                // listeningActivity: ""
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
        else if (err)
            return res.send({ message: "Error Occured" });
    })
})

app.get('/csvdata', (req, res) => {
    csvtojson()
        .fromFile('./mrs_data_v1.csv')
        .then((json) => {
            res.json(json);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error reading CSV file');
        });
});

app.get('/csvdata/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);
    csvtojson()
        .fromFile('./mrs_data_v1.csv')
        .then((data) => {
            // console.log(id);
            const filterById = data.filter((d) => {
                if (d['track_id'] === id) return (d);
            })
            res.send(filterById);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error reading CSV file');
        });
});

// Define a route for getting the audio features of a song
app.get('/song-audio-features', (req, res) => {
    const songName = req.query.songName; // The Spotify ID of the song to get audio features for
    // Using SpotifyCreds to access
    spotifyApi.clientCredentialsGrant()
        .then(data => {
            // Setting Access token to use the api
            spotifyApi.setAccessToken(data.body.access_token);
        })
        .then(_ => {
            // access token is still valid, make Spotify API requests here using the accessToken variable
            spotifyApi.searchTracks(`track:${songName}`)
                .then(data => {
                    // Get the Spotify ID of the first result
                    songId = data.body.tracks?.items[0]?.id;
                    // Get the audio features of the song with the Spotify ID
                    return spotifyApi.getAudioFeaturesForTrack(songId);
                })
                .then(data => {
                    // Send the audio features data back to the client
                    const { uri, acousticness, danceability, duration_ms, energy, instrumentalness, key,
                        liveness, loudness, mode, speechiness, tempo, time_signature, valence } = data.body
                    const responseData = {
                        uri, acousticness, danceability, duration_ms, energy, instrumentalness, key,
                        liveness, loudness, mode, speechiness, tempo, time_signature, valence
                    }
                    res.send(responseData);
                })
                .catch(error => {
                    console.log('Error searching for song or getting audio features:', error);
                    res.status(500).send('Error searching for song or getting audio features');
                });
        })
        .catch(error => {
            // access token expired, time to refresh
            console.log('Error obtaining access token:', error);
            spotifyApi.refreshAccessToken()
                .then(data => {
                    const accessToken = data.body.access_token;
                    console.log(data.body.expires_in);
                    spotifyApi.setAccessToken(accessToken);
                })
                .catch(err => res.send(err))
        });
})

app.post("/addMusic", (req, res) => {
    const { id, name, duration, primaryArtists, language, url, image, downloadUrl, uri,
        acousticness,
        danceability,
        duration_ms,
        energy,
        instrumentalness,
        key,
        liveness,
        loudness,
        mode,
        speechiness,
        tempo,
        time_signature,
        valence } = req.body.musicData;
    Music.findOne({ track_id: id }, (err, trackExists) => {
        if (!trackExists) {
            const music = new Music({
                track_id: id,
                track_name: name,
                duration: duration,
                primary_artists: primaryArtists,
                language: language,
                track_url: url,
                track_image: image[2].link,
                download_url: downloadUrl[4].link,
                spotify_track_id: uri?.split(":")[2],
                acousticness,
                danceability,
                duration_ms,
                energy,
                instrumentalness,
                key,
                liveness,
                loudness,
                mode,
                speechiness,
                tempo,
                time_signature,
                valence,
                play_count: 0
            })
            // Save Music data
            music.save((error) => {
                if (error)
                    return res.status(500).send({ message: error });
                return res.status(200).send({ message: "Music Details stored successfully" });
            })
        }
    })
})

// Handle POST requests to /addMusicToListeningHistory
app.post('/addMusicToListeningHistory', async (req, res) => {
    const currTrackId = req.body.currTrackId;
    const currUserId = req.body.currUserId;
    try {
        const user = await User.findById(currUserId);
        let listeningActivity = user.listeningActivity;
        if (!listeningActivity) {
            listeningActivity = [currTrackId];
        } else {
            if (listeningActivity.length >= 5) {
                listeningActivity.shift(); // remove oldest element from front of array
            }
            listeningActivity.push(currTrackId);
        }
        user.listeningActivity = listeningActivity;
        await user.save();
        res.json({ data: listeningActivity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/getLastListenedMusic", async (req, res) => {
    const userId = req.query.currUserId;
    try {
        const user = await User.findById(userId);
        const listeningActivity = user.listeningActivity;
        const lastListenedMusic = listeningActivity[listeningActivity.length - 1];
        // const music = await Music.findOne({ track_id: lastListenedMusic });
        res.json({ lastListenedMusic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Server setup
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});