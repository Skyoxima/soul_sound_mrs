import React, { useEffect } from 'react'
import { useState } from 'react'
import './Searchbar.css';
import ToggleTheme from '../ToggleTheme/ToggleTheme';
import apiClient from '../../../spotify';

function Searchbar({ setCurrTrack }) {
    const [searchText, setSearchText] = useState("");
    const [searchMusic, setSearchMusic] = useState(null);
    useEffect(() => {
        if (searchText.length > 0) {
            apiClient.get(`search?q=${searchText}&type=track`).then((res) => {
                setSearchMusic(res.data.tracks.items[0]);
            })
        }
    }, [searchText])


    const handleSearchInput = (e) => {
        setSearchText(e.target.value);
    }

    return (
        <div className='search-box'>
            <input type="text" placeholder='🔍 Search...' value={searchText} onChange={(e) => { handleSearchInput(e) }} />
            <button onClick={() => { setCurrTrack(searchMusic); setSearchText(""); }}>Submit</button>
            <ToggleTheme />
        </div>
    )
}

export default Searchbar