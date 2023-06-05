import React from 'react'

import Sidebar from '../Sidebar/Sidebar'
import Searchbar from '../MainPage/Searchbar/Searchbar'
import Player from '../MainPage/Player/Player'
import RecommendQueue from '../MainPage/RecommendQueue/RecommendQueue'

function HomeLayout(props) {

    return (
        <>
            <div className='main-page'>
                <div className='left'>
                    <Sidebar />
                </div>
                <div className='center'>
                    <Searchbar />
                    {props.children}
                </div>
                <div className='right'>
                    <Player />
                    <RecommendQueue />
                </div>
            </div>
        </>
    )
}

export default HomeLayout