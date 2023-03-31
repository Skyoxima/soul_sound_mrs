import './App.css';
import Login from './components/Login/Login';
// import ErrorPage from './components/ErrorPage/ErrorPage';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { setClientToken } from './spotify';
import { useEffect, useState } from 'react';
import Favorites from './components/MainPage/Favorites/Favorites';
import Sidebar from './components/Sidebar/Sidebar';
import Searchbar from './components/MainPage/Searchbar/Searchbar';
import Albums from './components/MainPage/Albums/Albums';
import Artists from './components/MainPage/Artists/Artists';
import Player from './components/MainPage/Player/Player';
import Home from './components/MainPage/Home/Home';
import Recommend from './components/MainPage/Recommend/Recommend';

function App() {
  const [token, setToken] = useState("");
  const [currTrack, setCurrTrack] = useState({});

  useEffect(() => {
    // token is generated in the website url which is required to be stored in our local storage for further use
    const token = window.sessionStorage.getItem("token");
    // this helps us to get the access token after hash
    const hash = window.location.hash;
    // clear the hash from website url
    window.location.hash = "";

    if (!token && hash) {
      const _token = hash.split("&")[0].split("=")[1];
      window.sessionStorage.setItem("token", _token);
      setToken(_token);
      setClientToken(_token);
    } else {
      setToken(token);
      setClientToken(token);
    }
  }, []);
  return (
    <div className="App">
      {(!token) ? (<Login />) : (
        <>
          <Router>
            <div className='main-page'>
              <div className='left'>
                <Sidebar />
              </div>
              <div className='center'>
                <Searchbar setCurrTrack={setCurrTrack} />
                <Routes>
                  <Route path='/' element={!token ? (<Link to="/login" />) : (<Home />)} />
                  <Route path='/home' element={<Home setCurrTrack={setCurrTrack} />} />
                  <Route path='/albums' element={<Albums />} />
                  <Route path='/artists' element={<Artists />} />
                  <Route path='/favorites' element={<Favorites />} />
                  {/* <Route path="/logout" element={<Link to="/" />} /> */}
                  {/* <Route path='*' element={<ErrorPage />} /> */}
                </Routes>
              </div>
              <div className='right'>
                <Player currTrack={currTrack} />
                <Recommend />
              </div>
            </div>
          </Router>
        </>
      )
      }

    </div >
  );
}

export default App;
