import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { createContext, useState } from 'react';

import Home from './components/MainPage/Home/Home';
import Recommends from './components/MainPage/Recommends/Recommends';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

import UseAuth from './utils/UseAuth';
import ProtectedRoute from './utils/ProtectedRoute';
import HomeLayout from './components/HomeLayout/HomeLayout';

export const currTrackContext = createContext();
export const reccTrackContext = createContext();

function App() {
  const [currTrack, setCurrTrack] = useState(null);
  const [reccTrack, setReccTrack] = useState(false);
  const [isLoginAuth, isSignupAuth] = UseAuth();

  return (
    <div className="App">
      <Router>
        <currTrackContext.Provider value={{ currTrack, setCurrTrack }}>
          <reccTrackContext.Provider value={{ reccTrack, setReccTrack }}>
            <>
              <Routes>
                <Route exact path='/' element={(!isLoginAuth) ? (<Login />) : (<Home />)} />
                <Route path='/login' element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path='/home' element={<ProtectedRoute><HomeLayout><Home /></HomeLayout></ProtectedRoute>} />
                <Route path='/recommends' element={<ProtectedRoute><HomeLayout><Recommends /></HomeLayout></ProtectedRoute>} />
              </Routes>
            </>
          </reccTrackContext.Provider>
        </currTrackContext.Provider>
      </Router>
    </div >
  );
}

export default App;
