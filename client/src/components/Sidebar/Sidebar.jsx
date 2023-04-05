import React, { useEffect, useState } from 'react';
import '../Sidebar/Sidebar.css';
import SidebarButton from './SidebarButton';

import { MdFavorite } from "react-icons/md";
import { FaGripfire } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import apiClient from '../../spotify';

function Sidebar() {
  const [image, setImage] = useState("https://media.istockphoto.com/id/1351686559/vector/golden-star-with-sparkle-glitter-stardust-glow.jpg?s=612x612&w=0&k=20&c=fBOD2ly32RYfj4y8JOU-B6h3RMCT5JPVK93AFGzQAjc=");
  const [currUser, setCurrUser] = useState(null);
  useEffect(() => {
    // apiClient.get("https://api.spotify.com/v1/me").then((response) => {
    //   // setImage(response.data.images[0]);
    //   if (response.data.images.length > 0)
    //     setImage(response.data.images[0].url)
      // setCurrUser(response.data.display_name);
    // });
    setCurrUser(localStorage.getItem("currUser"));
  }, []);

  return (
    <div className='sidebar-container'>
      <div className='sidebar-logo'>
        <img src={image} alt="system-logo" />
        <p>{currUser}</p>
      </div>
      <div className='sidebar-body'>
        <div className='sidebar-title'>
          <h3>Menu</h3>
        </div>
        <div className='sidebar-btns'>
          <SidebarButton title="Home" to="/home" icon={<MdSpaceDashboard />} />
          <SidebarButton title="Albums" to="/albums" icon={<IoLibrary />} />
          <SidebarButton title="Recommends" to="/recommends" icon={<FaGripfire />} />
          <SidebarButton title="Favorites" to="/favorites" icon={<MdFavorite />} />
        </div>
      </div>
      <div className='sidebar-signout'>
        <SidebarButton title="Log Out" to="/logout" icon={<FaSignOutAlt />} />
      </div>
    </div>
  )
}

export default Sidebar