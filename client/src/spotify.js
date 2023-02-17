import axios from "axios";

const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize?";
const CLIENT_ID = "834b14f2ed974573a45138c3b0736c2d";
const REDIRECT_URI = "http://localhost:3000"
const SCOPES = ["streaming", "user-read-private", "playlist-read-private", "user-library-read", "user-library-modify", "user-read-playback-state", "user-modify-playback-state"]

export const AUTH_URL = `${AUTH_ENDPOINT}client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=token&show_dialogue=true`;

// Creates a axios instance
const apiClient = axios.create({
    baseURL: "https://api.spotify.com/v1/",
});

export const setClientToken = (token) => {
    apiClient.interceptors.request.use(async function (config) {
        config.headers.Authorization = "Bearer " + token;
        return config;
    });
};

export default apiClient;