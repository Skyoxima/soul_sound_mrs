import React from 'react'
import { useState } from 'react'
import './Searchbar.css';
import ToggleTheme from '../ToggleTheme/ToggleTheme';


function Searchbar() {

    const [searchText, setSearchText] = useState("");
    const handleSearchInput = (e) => {
        setSearchText(e.target.value);
    }

    return (
        <div className='search-box'>
            <input type="text" placeholder='🔍 Search...' value={searchText} onChange={(e) => { handleSearchInput(e) }} />
            <ToggleTheme />
        </div>
    )
}

export default Searchbar