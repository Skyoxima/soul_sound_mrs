import './App.css';
import Login from './components/Login/Login';
// import Signup from './components/Signup/Signup';
import MainPage from './components/MainPage/MainPage';
// import ErrorPage from './components/ErrorPage/ErrorPage';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { setClientToken } from './spotify';
import { useEffect, useState } from 'react';
import Favorites from './components/MainPage/Favorites/Favorites';

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    // token is generated in the website url which is required to be stored in our local storage for further use
    const token = window.localStorage.getItem("token");
    // this helps us to get the access token after hash
    const hash = window.location.hash;
    // clear the hash from website url
    window.location.hash = "";

    if (!token && hash) {
      const _token = hash.split("&")[0].split("=")[1];
      window.localStorage.setItem("token", _token);
      setToken(_token);
      setClientToken(_token);
    } else {
      setToken(token);
      setClientToken(token);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={!token ? (<Login />) : (<MainPage />)} />
          <Route path='/login' element={<Login />} />
          {/* <Route path='/signup' element={<Signup />} /> */}
          <Route path='/home' element={<MainPage />} />
          {/* <Route path='*' element={<ErrorPage />} /> */}
          <Route path='/favorites' element={<Favorites />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
