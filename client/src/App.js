import './App.css';
import Login from './components/Login/Login';
// import ErrorPage from './components/ErrorPage/ErrorPage';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { setClientToken } from './spotify';
import { createContext, useEffect, useState } from 'react';
import Favorites from './components/MainPage/Favorites/Favorites';
import Sidebar from './components/Sidebar/Sidebar';
import Searchbar from './components/MainPage/Searchbar/Searchbar';
import Albums from './components/MainPage/Albums/Albums';
// import Artists from './components/MainPage/Artists/Artists';
import Player from './components/MainPage/Player/Player';
import Home from './components/MainPage/Home/Home';
import RecommendQueue from './components/MainPage/RecommendQueue/RecommendQueue';
import Recommends from './components/MainPage/Recommends/Recommends';
import Signup from './components/Signup/Signup';
import axios from 'axios';

export const currTrackContext = createContext();

function App() {
  const [isLoginAuth, setIsLoginAuth] = useState(false);
  const [isSignupAuth, setIsSignupAuth] = useState(false);
  const [currTrack, setCurrTrack] = useState(null);

  useEffect(() => {
    setIsSignupAuth(localStorage.getItem("isSignupAuth"));
    setIsLoginAuth(localStorage.getItem("isLoginAuth"));
  }, []);
  return (
    <div className="App">
      <Router>
        {(!isSignupAuth ? (<Signup />)
          : ((!isLoginAuth) ? (<Login />) :
            <>
              <div className='main-page'>
                <div className='left'>
                  <Sidebar />
                </div>
                <currTrackContext.Provider value={{ currTrack, setCurrTrack }}>
                  <div className='center'>
                    <Searchbar
                      setCurrTrack={setCurrTrack}
                    />
                    <Routes>
                      <Route exact path='/' element={(!isLoginAuth) ? (<Login />) : (<Home />)} />
                      <Route path='/login' element={<Login />} />
                      <Route path='/home' element={<Home />} />
                      <Route path='/albums' element={<Albums />} />
                      <Route path='/recommends' element={<Recommends />} />
                      {/* <Route path='/artists' element={<Artists />} />  */}
                      <Route path='/favorites' element={<Favorites />} />
                      <Route path="/signup" element={<Signup />} />
                      {/* <Route path="/logout" element={<Link to="/" />} /> */}
                      {/* <Route path='*' element={<ErrorPage />} /> */}
                    </Routes>
                  </div>
                  <div className='right'>
                    <Player />
                    <RecommendQueue />
                  </div>
                </currTrackContext.Provider>
              </div>
            </>
          ))
        }
      </Router>
    </div >
  );
}

export default App;
