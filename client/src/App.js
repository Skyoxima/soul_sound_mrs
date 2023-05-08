import './App.css';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { createContext, useState } from 'react';
import Albums from './components/MainPage/Albums/Albums';
import Home from './components/MainPage/Home/Home';
import Recommends from './components/MainPage/Recommends/Recommends';
import Signup from './components/Signup/Signup';
import UseAuth from './utils/UseAuth';
import ProtectedRoute from './utils/ProtectedRoute';
import HomeLayout from './components/HomeLayout/HomeLayout';

export const currTrackContext = createContext();

function App() {
  const [currTrack, setCurrTrack] = useState(null);
  const [isLoginAuth, isSignupAuth] = UseAuth();

  return (
    <div className="App">
      <Router>
        <currTrackContext.Provider value={{ currTrack, setCurrTrack }}>
          <>
            <Routes>
              <Route exact path='/' element={(!isLoginAuth) ? (<Login />) : (<Home />)} />
              <Route path='/login' element={<Login />} />
              <Route path='/home' element={<ProtectedRoute><HomeLayout><Home /></HomeLayout></ProtectedRoute>} />
              <Route path='/albums' element={<ProtectedRoute><HomeLayout><Albums /></HomeLayout></ProtectedRoute>} />
              <Route path='/recommends' element={<ProtectedRoute><HomeLayout><Recommends /></HomeLayout></ProtectedRoute>} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </>
        </currTrackContext.Provider>
      </Router>
    </div >
  );
}

export default App;
