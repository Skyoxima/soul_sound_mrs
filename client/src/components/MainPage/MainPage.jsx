import React from 'react'
// import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar'
import Searchbar from './Searchbar/Searchbar'
import TopCollections from './TopCollections';
// import TopTrending from './TopTrending';
import './MainPage.css';

function MainPage() {

    // const location = useLocation();
    // console.log(location.state);

    return (
        <div className='main-page'>
            <div className='left'>
                <Sidebar />
            </div>
            <div className='center'>
                <Searchbar />
                <TopCollections />
                {/* <TopTrending /> */}
            </div>
        </div>
    )
}

export default MainPage